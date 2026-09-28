import { NextResponse } from "next/server";
import { fetchThumbnail, isDriveConfigured } from "@/lib/drive";

export const dynamic = "force-dynamic";

/**
 * Thumbnail publik sebuah karya dari Google Drive.
 * Token OAuth tetap di server — browser hanya menerima byte gambar.
 * Dipakai oleh workPhotoUrl() untuk karya yang diunggah via /admin.
 */
export async function GET(
  _req: Request,
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
    const res = await fetchThumbnail(id);
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("[drive/thumb]", id, e);
    return NextResponse.json(
      { error: "Thumbnail tidak ditemukan." },
      { status: 404 }
    );
  }
}
