import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/owner-guard";

export const dynamic = "force-dynamic";

/** Endpoint diagnosa: terima chunk tanpa teruskan ke Google. */
export async function POST(request: Request) {
  const gate = await requireOwner();
  if (!gate.ok) return gate.response;

  const chunk = await request.arrayBuffer().catch(() => null);
  return NextResponse.json({
    ok: true,
    receivedBytes: chunk?.byteLength ?? 0,
  });
}
