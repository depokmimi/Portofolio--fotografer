"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">Terjadi kesalahan</p>
      <h1 className="font-display mt-4 text-5xl text-white uppercase md:text-7xl">
        Lensa Berembun
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
        Ada yang tidak beres saat memuat halaman ini. Coba muat ulang, atau kembali ke beranda.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="bg-white px-8 py-3 text-[11px] font-bold tracking-[0.25em] text-black uppercase"
        >
          Muat ulang
        </button>
        <Link
          href="/"
          className="border border-white/30 px-8 py-3 text-[11px] tracking-[0.25em] text-white uppercase transition-colors hover:bg-white hover:text-black"
        >
          Beranda
        </Link>
      </div>
    </main>
  );
}
