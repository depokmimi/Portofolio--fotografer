import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Wedding", "Prewedding", "Portrait", "Wisuda", "Keluarga", "Event"];

/** Import file yang sudah ada di Drive (upload via aplikasi Drive) jadi karya. */
export async function POST(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  const body = (await request.json().catch(() => null)) as {
    driveFileId?: string;
    name?: string;
    mimeType?: string;
    title?: string;
    category?: string;
  } | null;

  const driveFileId = String(body?.driveFileId ?? "").trim();
  const title = String(body?.title ?? "").trim();
  const category = CATEGORIES.includes(String(body?.category)) ? String(body?.category) : CATEGORIES[0];
  const mimeType = String(body?.mimeType ?? "");

  if (!driveFileId || !/^[A-Za-z0-9_-]{10,}$/.test(driveFileId)) {
    return NextResponse.json({ error: "Drive file ID tidak valid." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }

  const type = mimeType.startsWith("video") ? "video" : "photo";

  try {
    const sb = getSupabaseAdmin();
    // Cek sudah ada atau belum
    const { data: existing } = await sb
      .from("works")
      .select("id")
      .eq("drive_file_id", driveFileId)
      .limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "File ini sudah terdaftar sebagai karya." }, { status: 409 });
    }
    // Posisi terakhir
    const { data: last } = await sb
      .from("works")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const position = (last?.[0]?.position ?? -1) + 1;

    const { error } = await sb.from("works").insert({
      title,
      category,
      type,
      drive_file_id: driveFileId,
      position,
      is_featured: false,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Gagal menyimpan karya.", detail: e instanceof Error ? e.message : "" },
      { status: 500 }
    );
  }
}
