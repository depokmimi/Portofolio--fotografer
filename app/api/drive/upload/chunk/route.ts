import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Proxy chunk upload: browser -> server kita -> Google Drive.
 * Menghindari masalah CORS/jaringan langsung browser -> Google.
 * Body: binary chunk mentah. Query: session (encoded sessionUri), start, end, total.
 */
export async function POST(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  const url = new URL(request.url);
  const sessionUri = request.headers.get("x-session-uri") || "";
  const start = parseInt(url.searchParams.get("start") || "", 10);
  const end = parseInt(url.searchParams.get("end") || "", 10);
  const total = parseInt(url.searchParams.get("total") || "", 10);

  if (!sessionUri || !Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(total)) {
    return NextResponse.json({ error: "Parameter tidak lengkap." }, { status: 400 });
  }
  // Validasi sessionUri hanya ke Google
  if (!sessionUri.startsWith("https://www.googleapis.com/upload/drive/")) {
    return NextResponse.json({ error: "Session URI tidak valid." }, { status: 400 });
  }

  const chunk = await request.arrayBuffer().catch(() => null);
  if (!chunk || chunk.byteLength === 0) {
    return NextResponse.json({ error: "Chunk kosong." }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    let res: Response;
    try {
      res = await fetch(sessionUri, {
        method: "PUT",
        headers: {
          "Content-Length": String(chunk.byteLength),
          "Content-Range": `bytes ${start}-${end - 1}/${total}`,
        },
        body: chunk,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (res.status === 308) {
      const range = res.headers.get("range");
      return NextResponse.json({ status: 308, range });
    }
    if (res.ok) {
      const file = (await res.json().catch(() => ({}))) as { id?: string };
      return NextResponse.json({ status: 200, id: file.id || null });
    }
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `Google menolak chunk (${res.status})`, detail: detail.slice(0, 200) },
      { status: 502 }
    );
  } catch (e) {
    const isAbort = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        error: isAbort ? "Timeout menghubungi Google (25 dtk)." : "Gagal menghubungi Google.",
        detail: e instanceof Error ? e.message : ""
      },
      { status: 502 }
    );
  }
}
