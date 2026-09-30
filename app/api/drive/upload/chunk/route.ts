import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Batas waktu satu percobaan chunk ke Google. Dengan body yang di-streaming,
// timer ini juga memutus percobaan yang macet karena koneksi browser lambat.
const GOOGLE_TIMEOUT_MS = 45_000;
// Pengaman: tolak chunk raksasa sebelum sempat membebani function.
const MAX_CHUNK_BYTES = 8 * 1024 * 1024;

/**
 * Proxy chunk upload: browser -> server kita -> Google Drive.
 * Menghindari masalah CORS/jaringan langsung browser -> Google.
 * Body: binary chunk mentah. Query: session (encoded sessionUri), start, end, total.
 *
 * Body diteruskan sebagai stream langsung ke Google (bukan di-buffer dulu),
 * sehingga byte mulai mengalir ke Google selagi browser masih mengunggah —
 * total waktu satu percobaan jauh lebih pendek dan tidak rawan timeout.
 */
export async function POST(request: Request) {
  const t0 = Date.now();
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;
  const tAuth = Date.now();

  const url = new URL(request.url);
  const sessionUri = request.headers.get("x-session-uri") || "";
  const start = parseInt(url.searchParams.get("start") || "", 10);
  const end = parseInt(url.searchParams.get("end") || "", 10);
  const total = parseInt(url.searchParams.get("total") || "", 10);

  if (
    !sessionUri ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(total) ||
    end <= start
  ) {
    return NextResponse.json({ error: "Parameter tidak lengkap." }, { status: 400 });
  }
  // Validasi sessionUri hanya ke Google
  if (!sessionUri.startsWith("https://www.googleapis.com/upload/drive/")) {
    return NextResponse.json({ error: "Session URI tidak valid." }, { status: 400 });
  }
  const chunkLen = end - start;
  if (chunkLen > MAX_CHUNK_BYTES) {
    return NextResponse.json({ error: "Chunk terlalu besar." }, { status: 413 });
  }
  if (!request.body) {
    return NextResponse.json({ error: "Chunk kosong." }, { status: 400 });
  }

  const timing = {
    authMs: tAuth - t0,
    recvMs: 0,
    googleMs: 0,
  };

  const tGoogleStart = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOOGLE_TIMEOUT_MS);
  try {
    const googleInit: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Length": String(chunkLen),
        "Content-Range": `bytes ${start}-${end - 1}/${total}`,
      },
      body: request.body,
      signal: controller.signal,
    };
    // undici mewajibkan duplex:"half" untuk request body berbentuk stream.
    (googleInit as Record<string, unknown>).duplex = "half";

    const res = await fetch(sessionUri, googleInit);
    timing.googleMs = Date.now() - tGoogleStart;

    if (res.status === 308) {
      const range = res.headers.get("range");
      return NextResponse.json({ status: 308, range, timing });
    }
    if (res.ok) {
      const file = (await res.json().catch(() => ({}))) as { id?: string };
      return NextResponse.json({ status: 200, id: file.id || null, timing });
    }
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `Google menolak chunk (${res.status})`, detail: detail.slice(0, 200), timing },
      { status: 502 }
    );
  } catch (e) {
    timing.googleMs = Date.now() - tGoogleStart;
    const isAbort = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        error: isAbort
          ? "Timeout meneruskan chunk ke Google (45 dtk)."
          : "Gagal menghubungi Google.",
        detail: e instanceof Error ? e.message : "",
        timing,
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
