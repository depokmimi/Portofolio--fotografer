"use client";

import Link from "next/link";
import Reveal from "./Reveal";

const works = [
  { src: "/images/wedding.jpg", alt: "Momen wedding hitam putih", label: "Wedding" },
  { src: "/images/prewed.jpg", alt: "Prewedding hitam putih", label: "Prewedding" },
  { src: "/images/wisuda.jpg", alt: "Wisuda hitam putih", label: "Wisuda" },
  { src: "/images/hero.jpg", alt: "Pasangan pengantin", label: "Wedding" },
];

export default function SelectedWorks() {
  return (
    <section className="border-t border-line px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.34em] text-muted">
              Pilihan
            </p>
            <h2 className="font-display text-[12vw] leading-[0.9] uppercase md:text-[4.5vw]">
              Karya Pilihan
            </h2>
          </div>
          <Link
            href="/galeri"
            className="hidden shrink-0 border border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper sm:block"
          >
            Semua →
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {works.map((w, i) => (
          <Reveal key={w.src} delay={(i % 4) * 0.07}>
            <Link href="/galeri" className="group relative block overflow-hidden">
              <img
                src={w.src}
                alt={w.alt}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover grayscale transition-transform duration-700 group-hover:scale-108"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-[11px] font-medium uppercase tracking-[0.24em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {w.label}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 text-center sm:hidden">
        <Link
          href="/galeri"
          className="inline-block border border-line px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
        >
          Semua Karya →
        </Link>
      </Reveal>
    </section>
  );
}
