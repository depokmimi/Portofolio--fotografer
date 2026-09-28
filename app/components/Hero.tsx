"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const words = ["MUHAMAD", "RAMDHANI"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative grid min-h-[100dvh] overflow-hidden md:grid-cols-2"
    >
      {/* Teks kiri */}
      <div className="flex flex-col justify-center px-5 pt-28 pb-10 md:px-12 md:pt-24 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-5 text-[11px] font-medium uppercase tracking-[0.34em] text-muted"
        >
          Fotografer — Indonesia
        </motion.p>
        <h1 className="font-display text-[17vw] leading-[0.88] tracking-tight uppercase md:text-[7.2vw]">
          {words.map((word, i) => (
            <span key={word} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={reduce ? undefined : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.45 + i * 0.14,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-muted"
        >
          Mengabadikan momen berharga — wedding, prewedding, wisuda, dan
          portrait — dengan sentuhan sinematik yang dramatis.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/galeri"
            className="bg-ink px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-paper transition-transform hover:scale-[1.03]"
          >
            Lihat Karya
          </Link>
          <a
            href="https://wa.me/6285811053787?text=Halo%2C%20saya%20tertarik%20dengan%20jasa%20fotografi%20Anda."
            target="_blank"
            rel="noopener"
            className="border border-line px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper"
          >
            Chat WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Foto kanan */}
      <div className="relative min-h-[62vh] overflow-hidden md:min-h-0">
        <motion.img
          src="/images/portrait.jpg"
          alt="Portrait hitam putih dramatis"
          style={reduce ? undefined : { y: imgY }}
          initial={reduce ? undefined : { scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-paper/60 via-transparent to-transparent md:bg-gradient-to-r md:from-paper md:via-transparent md:to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
