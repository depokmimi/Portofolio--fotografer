"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Lightbox, { type LightboxPhoto } from "../components/Lightbox";
import Reveal from "../components/Reveal";

interface Photo extends LightboxPhoto {
  category: string;
}

const PHOTOS: Photo[] = [
  { src: "/images/wedding.jpg", title: "Janji Suci", category: "Wedding" },
  { src: "/images/prewed.jpg", title: "Cerita Kita Berdua", category: "Prewedding" },
  { src: "/images/portrait.jpg", title: "Tatapan", category: "Portrait" },
  { src: "/images/wisuda.jpg", title: "Hari Kelulusan", category: "Wisuda" },
  { src: "/images/hero.jpg", title: "Senja Pengantin", category: "Wedding" },
];

const FILTERS = ["Semua", "Wedding", "Prewedding", "Portrait", "Wisuda"];

export default function GaleriClient() {
  const [filter, setFilter] = useState("Semua");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "Semua" ? PHOTOS : PHOTOS.filter((p) => p.category === filter);

  return (
    <>
      <Nav />
      <main className="px-5 pt-24 pb-16 md:px-10 md:pt-28 md:pb-24">
        <PageHeader
          eyebrow="Fotografi — Indonesia"
          title="Galeri"
          desc="Klik karya mana pun untuk melihat lebih besar. Semua dalam hitam putih."
        />

        <div className="mt-10 mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setLightbox(null);
                }}
                aria-pressed={active}
                className={`cursor-pointer border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted">
            Belum ada karya di kategori ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {filtered.map((p, i) => (
              <Reveal key={p.src} delay={(i % 6) * 0.06}>
                <button
                  onClick={() => setLightbox(i)}
                  className="group relative block w-full cursor-pointer overflow-hidden text-left"
                  aria-label={`Lihat lebih besar: ${p.title}`}
                >
                  <img
                    src={p.src}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-sm font-semibold tracking-wide text-white">
                      {p.title}
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/70">
                      {p.category}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}

        <AnimatePresence>
          {lightbox !== null && (
            <Lightbox
              photos={filtered}
              index={lightbox}
              onClose={() => setLightbox(null)}
              onNav={setLightbox}
            />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
