import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["title", "category", "position", "is_featured", "duration"]);

/** Ubah metadata karya: judul, kategori, urutan, featured (owner only). */
export async function PATCH(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    patch?: Record<string, unknown>;
  } | null;

  if (!body?.id || typeof body.patch !== "object" || !body.patch) {
    return NextResponse.json({ error: "id dan patch wajib diisi." }, { status: 400 });
  }

  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body.patch)) {
    if (ALLOWED.has(k)) clean[k] = v;
  }
  if (Object.keys(clean).length === 0) {
    return NextResponse.json({ error: "Tidak ada field valid." }, { status: 400 });
  }
  if (typeof clean.title === "string") {
    clean.title = clean.title.trim().slice(0, 120);
  }

  try {
    const { data, error } = await gate.supabase
      .from("works")
      .update(clean)
      .eq("id", body.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ work: data });
  } catch (e) {
    console.error("[works/patch]", e);
    return NextResponse.json({ error: "Gagal memperbarui karya." }, { status: 500 });
  }
}
