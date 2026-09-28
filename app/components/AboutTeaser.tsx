import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function AboutTeaser() {
  return (
    <section className="border-t border-line px-5 py-20 md:px-10 md:py-28" aria-labelledby="tentang-singkat">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-line">
            <Image
              src="https://picsum.photos/seed/mrr-portrait/800/1000"
              alt="Potret Muhamad Ramdhani Rachmansyah"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-muted">
            Tentang Saya
          </p>
          <h2 id="tentang-singkat" className="font-display text-4xl leading-tight md:text-5xl">
            Saya mengabadikan momen yang tak terulang.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Fotografer berbasis di Indonesia dengan spesialisasi wedding,
            prewedding, wisuda, dan portrait. Gaya saya: natural, candid, dan
            penuh emosi — tanpa pose yang kaku.
          </p>
          <Link
            href="/tentang"
            className="mt-7 inline-block border border-ink px-7 py-3 text-[13px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
          >
            Kenalan Lebih Jauh
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
