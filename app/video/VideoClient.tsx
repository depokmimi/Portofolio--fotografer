"use client";

import { useCallback, useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import {
  getVideos,
  workVideoUrl,
  type WorkVideo,
} from "@/lib/works";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  poster: string;
  src: string;
}

// URL video sudah diverifikasi bisa diputar (v1).
const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Cinematic Wedding Film",
    category: "Wedding",
    duration: "02:45",
    poster: "/images/hero.jpg",
    src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    id: "v2",
    title: "Prewedding Senja",
    category: "Prewedding",
    duration: "01:30",
    poster: "/images/prewed.jpg",
    src: "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
  {
    id: "v3",
    title: "Wisuda: Hari Kelulusan",
    category: "Wisuda",
    duration: "01:15",
    poster: "/images/wisuda.jpg",
    src: "https://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: "v4",
    title: "Portrait in Motion",
    category: "Portrait",
    duration: "00:58",
    poster: "/images/portrait.jpg",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "v5",
    title: "Aftermovie Event",
    category: "Event",
    duration: "03:20",
    poster: "/images/wedding.jpg",
    src: "https://media.w3.org/2010/05/video/movie_300.mp4",
  },
  {
    id: "v6",
    title: "Cerita Keluarga",
    category: "Keluarga",
    duration: "02:10",
    poster: "/images/prewed.jpg",
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  },
];

function PlayBadge() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-[2px]" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export default function VideoClient() {
  const [active, setActive] = useState<number | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>(VIDEOS);

  // Ambil video yang diupload via /admin dari Supabase.
  // Kalau belum ada, pakai data contoh agar halaman tidak kosong.
  useEffect(() => {
    let cancelled = false;
    getVideos().then((db) => {
      if (cancelled || db.length === 0) return;
      setVideos(
        db.map((w) => ({
          id: w.id,
          title: w.title,
          category: w.category,
          duration: w.duration || "",
          poster: w.poster,
          src: workVideoUrl(w),
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...rest] = videos;

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  return (
    <>
      <Nav />
      <main className="px-5 pt-24 pb-16 md:px-10 md:pt-28 md:pb-24">
        <PageHeader
          eyebrow="Motion — Indonesia"
          title="Video"
          desc="Cerita yang bergerak — film wedding sinematik, aftermovie event, dan potret dalam gerak. Klik untuk menonton."
        />

        <Reveal delay={0.14} className="mt-10">
          <button
            onClick={() => setActive(0)}
            className="group relative block w-full cursor-pointer overflow-hidden text-left"
            aria-label={`Putar: ${featured.title}`}
          >
            <img
              src={featured.poster}
              alt={featured.title}
              className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="eager"
            />
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
            <span className="absolute top-4 left-4 bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-black uppercase">
              Showreel
            </span>
            <span className="absolute top-4 right-4 bg-black/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white">
              {featured.duration}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayBadge />
            </span>
            <span className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4">
              <span className="font-display text-[clamp(1.6rem,5vw,3rem)] leading-none text-white uppercase drop-shadow-lg">
                {featured.title}
              </span>
              <span className="shrink-0 text-[11px] tracking-[0.2em] text-white/80 uppercase">
                {featured.category}
              </span>
            </span>
          </button>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          {rest.map((v, i) => (
            <Reveal key={v.id} delay={(i % 2) * 0.08}>
              <figure>
              <button
                onClick={() => setActive(i + 1)}
                className="group block w-full cursor-pointer text-left"
                aria-label={`Putar: ${v.title}`}
              >
                <span className="relative block aspect-video w-full overflow-hidden">
                  <img
                    src={v.poster}
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/5" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <PlayBadge />
                  </span>
                  <span className="absolute right-3 bottom-3 bg-black/70 px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em] text-white">
                    {v.duration}
                  </span>
                </span>
                <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3">
                  <b className="font-display text-xl leading-tight font-normal tracking-wide uppercase">
                    {v.title}
                  </b>
                  <span className="shrink-0 text-[11px] tracking-[0.18em] text-muted uppercase">
                    {v.category}
                  </span>
                </figcaption>
              </button>
              </figure>
            </Reveal>
          ))}
        </div>

        {active !== null && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={videos[active].title}
          >
            <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="font-display text-lg tracking-wide text-white uppercase">
                  {videos[active].title}
                </p>
                <button
                  onClick={close}
                  aria-label="Tutup"
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-white/30 text-2xl text-white transition-colors hover:bg-white hover:text-black"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Video utama */}
                <div className="flex-1">
                  <video
                    key={videos[active].id}
                    src={videos[active].src}
                    controls
                    autoPlay
                    playsInline
                    className="aspect-video w-full bg-black"
                  />
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <p className="font-display text-xl tracking-wide text-white uppercase">
                      {videos[active].title}
                    </p>
                    <span className="shrink-0 text-[11px] tracking-[0.18em] text-white/50 uppercase">
                      {videos[active].category}
                    </span>
                  </div>
                </div>
                {/* Menu daftar video di samping */}
                <aside className="w-full shrink-0 lg:w-80">
                  <p className="mb-2 text-[11px] tracking-[0.25em] text-white/50 uppercase">
                    Video Lainnya ({videos.length - 1})
                  </p>
                  <div className="flex max-h-64 flex-col gap-2 overflow-y-auto lg:max-h-[60vh]">
                    {videos.map((v, i) =>
                      i === active ? null : (
                        <button
                          key={v.id}
                          onClick={() => setActive(i)}
                          className="group flex cursor-pointer items-center gap-3 border border-white/10 p-2 text-left transition-colors hover:border-white/30 hover:bg-white/5"
                        >
                          <span className="relative block aspect-video w-28 shrink-0 overflow-hidden">
                            <img
                              src={v.poster}
                              alt={v.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-white">
                              {v.title}
                            </span>
                            <span className="block text-[11px] tracking-[0.14em] text-white/40 uppercase">
                              {v.category} • {v.duration}
                            </span>
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
