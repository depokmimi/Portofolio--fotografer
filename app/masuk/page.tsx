"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { getSupabase, isOwnerEmail, isSupabaseConfigured } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.6 3.5 2.7.2.1c2.2-2 3.6-5 3.6-9.2z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.5 21.3 7.4 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.6-3.6-2.8-.1.1C.5 7.9 0 9.9 0 12s.5 4.1 1.4 5.8l3.8-3.4z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C16.9 1.1 14.2 0 12 0 7.4 0 3.5 2.7 1.4 6.6l3.8 3.1c1-2.9 3.7-5 6.8-5z"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function MasukPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) setFailed(true);
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const logout = async () => {
    await getSupabase()?.auth.signOut();
    setUser(null);
  };

  const owner = isOwnerEmail(user?.email);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0a0a0b] px-4 py-16">
      {/* Latar: cahaya keemasan mengalir */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/14 blur-[110px]" />
        <div className="absolute bottom-0 left-[8%] h-56 w-96 rounded-full bg-orange-600/10 blur-[100px]" />
        <div className="absolute right-[6%] bottom-[18%] h-44 w-72 rounded-full bg-yellow-400/8 blur-[90px]" />
      </div>

      {/* Kartu kaca 3D */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 40, rotateX: 12 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 16 }}
        style={{ transformPerspective: 1100 }}
        className="relative w-full max-w-[400px]"
      >
        <motion.div
          animate={
            reduceMotion
              ? {}
              : { y: [0, -10, 0], rotateX: [4, 6, 4], rotateY: [-3, 3, -3] }
          }
          transition={
            reduceMotion
              ? {}
              : { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformStyle: "preserve-3d" }}
          className="rounded-[28px] border border-white/12 bg-white/[0.06] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-10"
        >
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-white/40 uppercase">
            Area Pemilik
          </p>
          <h1 className="mt-3 text-[2rem] leading-tight font-bold text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Masuk untuk mengelola karya di galeri portofoliomu.
          </p>

          <div className="mt-8" style={{ transform: "translateZ(30px)" }}>
            {loading ? (
              <p className="py-4 text-center text-sm text-white/50">
                Memeriksa sesi…
              </p>
            ) : !configured ? (
              <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                Konfigurasi login belum lengkap. Hubungi pemilik ya.
              </p>
            ) : !user ? (
              <div>
                {failed && (
                  <p className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    Login gagal. Coba lagi ya.
                  </p>
                )}
                <motion.button
                  onClick={login}
                  whileTap={reduceMotion ? {} : { scale: 0.97 }}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#ffd60a] px-6 py-4 text-[1rem] font-bold text-black transition-colors hover:bg-[#ffde33]"
                >
                  <GoogleIcon />
                  Masuk dengan Google
                  <ArrowIcon />
                </motion.button>
                <p className="mt-5 text-center text-xs text-white/35">
                  Khusus pemilik — pengunjung tidak butuh masuk
                </p>
              </div>
            ) : owner ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[0.68rem] tracking-[0.22em] text-white/40 uppercase">
                  Masuk sebagai pemilik
                </p>
                <p className="mt-2 font-semibold break-all text-white">
                  {user.email}
                </p>
                <p className="mt-3 text-sm text-white/50">
                  Kelola karya portofoliomu di halaman admin.
                </p>
                <Link
                  href="/admin"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#ffd60a] px-6 py-3 text-sm font-bold tracking-wide text-black uppercase transition-colors hover:bg-[#ffde33]"
                >
                  Buka halaman admin →
                </Link>
                <button
                  onClick={logout}
                  className="mt-5 w-full cursor-pointer rounded-full border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-white/80 uppercase transition-colors hover:bg-white/10"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-400/25 bg-red-400/[0.07] p-5">
                <p className="text-lg font-bold text-white">
                  Akun ini bukan pemilik.
                </p>
                <p className="mt-2 text-sm break-all text-white/55">
                  {user.email} tidak punya akses ke area ini.
                </p>
                <button
                  onClick={logout}
                  className="mt-5 w-full cursor-pointer rounded-full border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-white/80 uppercase transition-colors hover:bg-white/10"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
