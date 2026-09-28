import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

let browserClient: SupabaseClient | null = null;

/** Browser client Supabase (auth + data). Null kalau env belum diisi. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}

/** Email pemilik — hanya email ini yang boleh masuk area admin. */
export function ownerEmail(): string {
  return process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
}

export function isOwnerEmail(email: string | undefined | null): boolean {
  const owner = ownerEmail();
  return Boolean(
    email && owner && email.toLowerCase() === owner.toLowerCase()
  );
}
