"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Reveal from "./Reveal";

const categories = [
  { no: "01", label: "Portrait", img: "/images/portrait.jpg" },
  { no: "02", label: "Wedding", img: "/images/wedding.jpg" },
  { no: "03", label: "Prewedding", img: "/images/prewed.jpg" },
  { no: "04", label: "Wisuda", img: "/images/wisuda.jpg" },
];

export default function Categories() {
  return (
    <section className="border-t border-line px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <p className="mb-10 text-[11px] font-medium uppercase tracking-[0.34em] text-muted">
          Kategori
        </p>
      </Reveal>
      <ul>
        {categories.map((c, i) => (
          <li key={c.no} className={i > 0 ? "border-t border-line" : ""}>
            <Reveal delay={i * 0.06}>
              <Link
                href="/galeri"
                className="group flex items-center gap-5 py-5 md:gap-10 md:py-7"
              >
                <span className="w-10 shrink-0 text-sm tracking-[0.2em] text-muted">
                  {c.no}
                </span>
                <span className="font-display flex-1 text-[11vw] leading-none uppercase transition-transform duration-500 group-hover:translate-x-3 md:text-[5.5vw]">
                  {c.label}
                </span>
                <span className="hidden h-20 w-32 shrink-0 overflow-hidden sm:block md:h-24 md:w-44">
                  <img
                    src={c.img}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-110"
                  />
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl transition-transform duration-500 group-hover:translate-x-2"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
