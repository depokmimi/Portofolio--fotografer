"use client";

import Reveal from "./Reveal";

export default function Quote() {
  return (
    <section className="border-t border-line px-5 py-20 text-center md:px-10 md:py-32">
      <Reveal>
        <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.34em] text-muted">
          Filosofi
        </p>
        <blockquote className="font-quote mx-auto max-w-4xl text-[7.5vw] leading-[1.15] italic md:text-[3.2vw]">
          “Saya tidak sekadar memotret — saya mengabadikan perasaan yang hidup
          di setiap momen.”
        </blockquote>
        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-muted">
          Muhamad Ramdhani Rachmansyah
        </p>
      </Reveal>
    </section>
  );
}
