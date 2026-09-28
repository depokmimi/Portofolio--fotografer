"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export interface LightboxPhoto {
  src: string;
  title: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onNav: (index: number) => void;
}

/** Lightbox hitam-putih: navigasi keyboard + tombol, swipe-friendly. */
export default function Lightbox({ photos, index, onClose, onNav }: LightboxProps) {
  const reduce = useReducedMotion();
  const photo = photos[index];

  const prev = useCallback(
    () => onNav((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNav]
  );
  const next = useCallback(
    () => onNav((index + 1) % photos.length),
    [index, photos.length, onNav]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
    >
      <div className="flex items-center justify-between py-2 text-white">
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
          {index + 1} / {photos.length}
        </p>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="flex h-11 w-11 cursor-pointer items-center justify-center border border-white/25 text-2xl transition-colors hover:bg-white hover:text-black"
        >
          ×
        </button>
      </div>
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.src}
            src={photo.src}
            alt={photo.title}
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="max-h-full max-w-full object-contain grayscale"
          />
        </AnimatePresence>
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Foto sebelumnya"
              className="absolute left-1 flex h-12 w-12 cursor-pointer items-center justify-center border border-white/25 bg-black/50 text-2xl text-white transition-colors hover:bg-white hover:text-black md:left-4"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Foto berikutnya"
              className="absolute right-1 flex h-12 w-12 cursor-pointer items-center justify-center border border-white/25 bg-black/50 text-2xl text-white transition-colors hover:bg-white hover:text-black md:right-4"
            >
              ›
            </button>
          </>
        )}
      </div>
      <p className="py-3 text-center text-sm tracking-wide text-white/80">
        {photo.title}
      </p>
    </motion.div>
  );
}
