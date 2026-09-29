import { NextResponse } from "next/server";
import { fetchDriveMedia, isDriveConfigured } from "@/lib/drive";

export const dynamic = "force-dynamic";

/**
 * Streaming publik sebuah video karya dari Google Drive.
 * Token OAuth tetap di server — browser hanya menerima byte video.
 * Mendukung Range agar video bisa seek/skip.
 * Dipakai oleh workVideoUrl() untuk video yang diunggah via /admin.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validasi format ID Drive (huruf, angka, - dan _) untuk cegah penyalahgunaan.
  if (!/^[A-Za-z0-9_-]{10,100}$/.test(id)) {
    return NextResponse.json({ error: "ID file tidak valid." }, { status: 400 });
  }
  if (!isDriveConfigured()) {
    return NextResponse.json(
      { error: "Drive belum disambungkan." },
      { status: 503 }
    );
  }
  try {
    const range = req.headers.get("range");
    const res = await fetchDriveMedia(id, range);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Video tidak ditemukan." },
        { status: res.status === 404 ? 404 : 502 }
      );
    }
    const headers: Record<string, string> = {
      "Content-Type": res.headers.get("content-type") ?? "video/mp4",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    };
    const contentRange = res.headers.get("content-range");
    if (contentRange) headers["Content-Range"] = contentRange;
    const contentLength = res.headers.get("content-length");
    if (contentLength) headers["Content-Length"] = contentLength;
    return new NextResponse(res.body, {
      status: res.status,
      headers,
    });
  } catch (e) {
    console.error("[drive/video]", id, e);
    return NextResponse.json(
      { error: "Gagal memutar video." },
      { status: 500 }
    );
  }
}
