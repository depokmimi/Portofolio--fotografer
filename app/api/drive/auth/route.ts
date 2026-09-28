import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isOwnerEmail } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

/**
 * Alur sekali pakai untuk mendapatkan refresh token Google Drive.
 * Hanya pemilik yang sudah login yang boleh mengakses.
 * Redirect URI rute ini wajib didaftarkan di Google Cloud Console:
 * https://portofolio-fotografer.vercel.app/api/drive/callback
 */
export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isOwnerEmail(user.email))
    return NextResponse.redirect(new URL("/masuk", request.url));

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId)
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID belum diisi di environment." },
      { status: 500 }
    );

  const origin = new URL(request.url).origin;
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/drive/callback`,
    response_type: "code",
    scope: DRIVE_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  res.cookies.set("drive_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
