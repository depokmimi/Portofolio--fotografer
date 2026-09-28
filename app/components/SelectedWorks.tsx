import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

const works = [
  {
    seed: "mrr-wedding-1",
    title: "Senja di Hari Bahagia",
    category: "Wedding",
    ratio: "aspect-[4/3]",
  },
  {
    seed: "mrr-prewed-1",
    title: "Dua Hati, Satu Cerita",
    category: "Prewedding",
    ratio: "aspect-[3/4]",
  },
  {
    seed: "mrr-wisuda-1",
    title: "Toga & Tawa",
    category: "Wisuda",
    ratio: "aspect-[16/10]",
  },
];

export default function SelectedWorks() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28" aria-labelledby="karya-pilihan">
      <Reveal>
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <h2 id="karya-pilihan" className="font-display text-4xl md:text-6xl">
            Karya Pilihan
          </h2>
          <Link
            href="/galeri"
            className="text-[13px] uppercase tracking-[0.18em] underline underline-offset-4"
          >
            Semua Karya
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {works.map((w, i) => (
          <Reveal key={w.seed} delay={i * 0.1}>
            <Link href="/galeri" className="group block">
              <div className={`relative overflow-hidden ${w.ratio} bg-line`}>
                <Image
                  src={`https://picsum.photos/seed/${w.seed}/900/900`}
                  alt={w.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted">
                {w.category}
              </p>
              <h3 className="font-display mt-1 text-2xl">{w.title}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
