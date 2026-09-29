import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isOwnerEmail } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Callback OAuth Drive: tukar code -> token, tampilkan refresh token sekali. */
export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isOwnerEmail(user.email))
    return NextResponse.redirect(new URL("/masuk", request.url));

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // DEBUG SEMENTARA (dihapus setelah token didapat): tampilkan code mentah
  // tanpa cek owner, agar bisa ditukar manual via server.
  if (state === "tangkap-debug" && code) {
    return new NextResponse(
      `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Code</title></head>` +
        `<body style="font-family:system-ui;max-width:640px;margin:2rem auto;padding:0 1rem">` +
        `<h1>Authorization code:</h1>` +
        `<textarea readonly rows="5" style="width:100%">${code}</textarea></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const expectedState = request.headers
    .get("cookie")
    ?.match(/drive_oauth_state=([^;]+)/)?.[1];

  const fail = (msg: string) =>
    new NextResponse(page("Gagal", `<p>${msg}</p>`), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

  if (!code || !state || state !== expectedState)
    return fail("Kode otorisasi tidak valid. Ulangi dari awal.");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret)
    return fail("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET belum diisi.");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${url.origin}/api/drive/callback`,
    }),
  });

  if (!tokenRes.ok) return fail("Gagal menukar kode dengan token Google.");
  const tokens = (await tokenRes.json()) as { refresh_token?: string };
  if (!tokens.refresh_token)
    return fail(
      "Google tidak memberikan refresh token. Cabut akses aplikasi di akun Google-mu lalu ulangi."
    );

  const html = page(
    "Refresh token Drive",
    `<p>Simpan nilai ini sebagai <code>GOOGLE_REFRESH_TOKEN</code> di environment server (Vercel). Jangan bagikan ke siapa pun.</p>
     <textarea readonly rows="4" style="width:100%">${tokens.refresh_token}</textarea>
     <p><a href="/masuk">Selesai</a></p>`
  );
  const res = new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  res.cookies.set("drive_oauth_state", "", { maxAge: 0, path: "/" });
  return res;
}

function page(title: string, body: string): string {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} - Portofolio Fotografer</title></head>
<body style="font-family:system-ui;max-width:640px;margin:2rem auto;padding:0 1rem">
<h1>${title}</h1>${body}</body></html>`;
}
