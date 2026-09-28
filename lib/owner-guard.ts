import { NextResponse } from "next/server";
import { createServerSupabase } from "./supabase-server";
import { isOwnerEmail } from "./supabase";

/**
 * Penjaga semua API admin: hanya pemilik yang login boleh lewat.
 * Jangan mengandalkan RLS/email client saja (PRD T-22).
 */
export async function requireOwner() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isOwnerEmail(user.email)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
      supabase: null,
      user: null,
    };
  }
  return { ok: true as const, response: null, supabase, user };
}
