import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";
import { getQuota, isDriveConfigured } from "@/lib/drive";

export const dynamic = "force-dynamic";

/** Status koneksi Drive untuk dasbor admin (owner only). */
export async function GET() {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  if (!isDriveConfigured()) {
    return NextResponse.json({ configured: false });
  }
  try {
    const quota = await getQuota();
    return NextResponse.json({ configured: true, quota });
  } catch (e) {
    console.error("[drive/status]", e);
    return NextResponse.json({
      configured: true,
      quota: null,
      warning: "Token Drive bermasalah — sambungkan ulang via /api/drive/auth.",
    });
  }
}
