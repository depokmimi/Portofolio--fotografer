import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";
import { deleteDriveFile, isDriveConfigured } from "@/lib/drive";

export const dynamic = "force-dynamic";

/** Hapus karya: file di Drive + baris di tabel works (owner only). */
export async function DELETE(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });

  try {
    const { data: work } = await gate.supabase
      .from("works")
      .select("id, drive_file_id")
      .eq("id", id)
      .single();

    if (!work) return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });

    if (isDriveConfigured() && work.drive_file_id) {
      try {
        await deleteDriveFile(work.drive_file_id);
      } catch (e) {
        console.error("[drive/files] hapus file Drive gagal", e);
        // Lanjut hapus baris DB agar tidak nyangkut.
      }
    }

    const { error } = await gate.supabase.from("works").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[drive/files]", e);
    return NextResponse.json({ error: "Gagal menghapus karya." }, { status: 500 });
  }
}
