import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

/** Google redirect ke sini habis login → tukar code jadi sesi → kembali ke /masuk. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/masuk?ok=1`);
    }
  }
  return NextResponse.redirect(`${origin}/masuk?error=1`);
}
