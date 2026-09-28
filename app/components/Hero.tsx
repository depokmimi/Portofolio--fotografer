"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-ink">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0">
        <motion.img
          src="https://picsum.photos/seed/mrr-hero/1800/1200"
          alt="Pasangan pengantin dalam balutan cahaya senja"
          className="h-full w-full object-cover"
          initial={reduce ? undefined : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--scrim) 0%, transparent 55%)",
        }}
        aria-hidden
      />
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-14 text-white md:px-10 md:pb-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-4 text-[12px] uppercase tracking-[0.3em] opacity-80"
        >
          Fotografer — Indonesia
        </motion.p>
        <h1 className="font-display max-w-5xl text-[13vw] leading-[0.95] md:text-[7.5rem]">
          {["Muhamad", "Ramdhani", "Rachmansyah"].map((word, i) => (
            <span key={word} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={reduce ? undefined : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.65 + i * 0.12,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/galeri"
            className="bg-white px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.03]"
          >
            Lihat Karya
          </Link>
          <a
            href="https://wa.me/6285811053787?text=Halo%2C%20saya%20tertarik%20dengan%20jasa%20fotografi%20Anda."
            target="_blank"
            rel="noopener"
            className="border border-white/70 px-7 py-3 text-[13px] uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-black"
          >
            Chat WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
