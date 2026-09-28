"use client";

import { motion } from "motion/react";
import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/video", label: "Video" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export default function Nav() {
  return (
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
        <Link href="/" className="font-display text-xl tracking-wide">
          MRR
        </Link>
        <ul className="hidden items-center gap-7 text-[13px] uppercase tracking-[0.18em] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="opacity-80 transition-opacity hover:opacity-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/kontak"
          className="border border-white/60 px-4 py-2 text-[12px] uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-black"
        >
          Booking
        </Link>
      </nav>
    </motion.header>
  );
}
