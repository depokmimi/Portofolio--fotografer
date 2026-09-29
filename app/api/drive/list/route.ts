import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";
import { getAccessToken, driveFolderId } from "@/lib/drive";

export const dynamic = "force-dynamic";

/** List file di folder Drive portofolio yang belum ada di database. */
export async function GET() {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  try {
    const token = await getAccessToken();
    const q = encodeURIComponent(`'${driveFolderId()}' in parents and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,size,createdTime)&orderBy=createdTime desc&pageSize=50`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Gagal membaca folder Drive." }, { status: 502 });
    }
    const data = await res.json();
    const files = (data.files || []).map((f: { id: string; name: string; mimeType: string; size?: string }) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size ? parseInt(f.size, 10) : 0,
      type: f.mimeType.startsWith("video") ? "video" : f.mimeType.startsWith("image") ? "photo" : "other",
    }));
    return NextResponse.json({ files });
  } catch (e) {
    return NextResponse.json(
      { error: "Gagal menghubungi Google Drive.", detail: e instanceof Error ? e.message : "" },
      { status: 502 }
    );
  }
}
