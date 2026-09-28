import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";
import { getDriveFile, isDriveConfigured } from "@/lib/drive";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Wedding", "Prewedding", "Portrait", "Wisuda", "Keluarga", "Event"];

/**
 * Finalisasi unggahan: verifikasi file benar-benar ada di Drive,
 * lalu catat metadata ke tabel works.
 */
export async function POST(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;
  if (!isDriveConfigured()) {
    return NextResponse.json({ error: "drive_not_configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    driveFileId?: string;
    title?: string;
    category?: string;
    type?: string;
    duration?: string;
  } | null;

  const driveFileId = String(body?.driveFileId ?? "");
  const title = String(body?.title ?? "").trim().slice(0, 120);
  const category = CATEGORIES.includes(String(body?.category))
    ? String(body?.category)
    : "Portrait";
  const type = body?.type === "video" ? "video" : "photo";
  const duration =
    type === "video" ? String(body?.duration ?? "").slice(0, 10) : null;

  if (!driveFileId || !title) {
    return NextResponse.json(
      { error: "driveFileId dan title wajib diisi." },
      { status: 400 }
    );
  }

  try {
    const file = await getDriveFile(driveFileId);
    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan di Drive — unggahan belum lengkap." },
        { status: 409 }
      );
    }

    // position = setelah item terakhir
    const { data: last } = await gate.supabase
      .from("works")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await gate.supabase
      .from("works")
      .insert({
        title,
        category,
        type,
        drive_file_id: driveFileId,
        duration,
        position: (last?.position ?? -1) + 1,
        is_featured: false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ work: data });
  } catch (e) {
    console.error("[drive/upload/selesai]", e);
    return NextResponse.json(
      { error: "Gagal menyimpan metadata karya." },
      { status: 500 }
    );
  }
}
