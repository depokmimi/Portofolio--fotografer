import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">Error 404</p>
      <h1 className="font-display mt-4 text-[22vw] leading-none text-white md:text-[10rem]">
        404
      </h1>
      <p className="mt-4 max-w-md font-serif text-xl text-white/70 italic">
        “Frame ini tidak ada dalam arsip saya.”
      </p>
      <Link
        href="/"
        className="mt-8 border border-white/30 px-8 py-3 text-[11px] tracking-[0.25em] text-white uppercase transition-colors hover:bg-white hover:text-black"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
