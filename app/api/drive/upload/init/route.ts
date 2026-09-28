import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";
import { createResumableSession, isDriveConfigured } from "@/lib/drive";

export const dynamic = "force-dynamic";

const PHOTO_MIMES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const VIDEO_MIMES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];

function sanitize(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_").slice(0, 120) || "tanpa-nama";
}

/**
 * Memulai unggahan: validasi -> buat sesi resumable Drive.
 * Browser mengunggah chunk LANGSUNG ke sessionUri (capability URL sekali pakai);
 * refresh token tidak pernah keluar dari server.
 */
export async function POST(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  if (!isDriveConfigured()) {
    return NextResponse.json(
      {
        error: "drive_not_configured",
        message:
          "Google Drive belum tersambung. Selesaikan langkah OAuth dulu (lihat kartu Status di /admin).",
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    mimeType?: string;
    size?: number;
  } | null;

  const name = sanitize(String(body?.name ?? ""));
  const mimeType = String(body?.mimeType ?? "");
  const size = Math.floor(Number(body?.size));

  const allowed = [...PHOTO_MIMES, ...VIDEO_MIMES];
  if (!allowed.includes(mimeType)) {
    return NextResponse.json(
      { error: "Format file tidak didukung. Hanya foto dan video." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(size) || size <= 0 || size > 5 * 1024 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran file tidak valid (maks 5 GB)." },
      { status: 400 }
    );
  }

  try {
    const sessionUri = await createResumableSession({ name, mimeType, size });
    return NextResponse.json({ sessionUri, name });
  } catch (e) {
    console.error("[drive/upload/init]", e);
    return NextResponse.json(
      { error: "Gagal membuat sesi unggah Drive." },
      { status: 502 }
    );
  }
}
