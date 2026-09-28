"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/video", label: "Video" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 mix-blend-difference"
      >
        <nav
          aria-label="Navigasi utama"
          className="flex items-center justify-between px-5 py-4 text-white md:px-10"
        >
          <Link
            href="/"
            className="font-display text-2xl tracking-wide"
            aria-label="Beranda"
          >
            MRR
          </Link>
          <ul className="hidden items-center gap-7 text-[12px] font-medium uppercase tracking-[0.22em] md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link
              href="/kontak"
              className="border border-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:bg-white hover:text-black"
            >
              Booking
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className="block h-px w-6 bg-white" />
              <span className="block h-px w-6 bg-white" />
              <span className="block h-px w-6 bg-white" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black px-6 pt-5 pb-10"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl tracking-wide text-white">MRR</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="flex h-10 w-10 items-center justify-center text-3xl text-white"
              >
                ×
              </button>
            </div>
            <nav aria-label="Navigasi seluler" className="mt-10 flex flex-col">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-white/10 py-5"
                  >
                    <span className="font-mono text-xs text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-4xl text-white uppercase">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="mt-auto text-center text-[11px] uppercase tracking-[0.3em] text-white/40">
              Muhamad Ramdhani Rachmansyah
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
