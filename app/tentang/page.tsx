import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { PHOTOGRAPHER_NAME, WA_GREETING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang — Muhamad Ramdhani Rachmansyah",
  description:
    "Tentang Muhamad Ramdhani Rachmansyah, fotografer wedding, prewedding, wisuda, dan portrait.",
};

const SERVICES = [
  { no: "01", label: "Wedding", desc: "Akad, resepsi, adat & internasional" },
  { no: "02", label: "Prewedding", desc: "Outdoor, studio, kasual" },
  { no: "03", label: "Portrait", desc: "Individu, couple, editorial" },
  { no: "04", label: "Wisuda", desc: "Individu & grup" },
  { no: "05", label: "Keluarga", desc: "Maternity, newborn, family session" },
  { no: "06", label: "Event", desc: "Seminar, konser, gathering" },
];

export default function TentangPage() {
  return (
    <>
      <Nav />
      <main className="px-5 pt-24 pb-16 md:px-10 md:pt-28 md:pb-24">
        <PageHeader eyebrow="Tentang Fotografer" title="Tentang" />

        <div className="mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <div className="overflow-hidden">
              <img
                src="/images/portrait.jpg"
                alt="Portrait hitam putih Muhamad Ramdhani Rachmansyah"
                className="aspect-[3/4] w-full object-cover grayscale"
                loading="eager"
              />
            </div>
          </Reveal>
          <div className="md:pt-4">
            <Reveal>
              <p className="font-quote text-[6.5vw] leading-[1.2] italic md:text-[2.2vw]">
                “Saya {PHOTOGRAPHER_NAME}. Bagi saya, satu frame yang kuat
                bukan sekadar indah — ia punya sikap.”
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
                <p>
                  Perjalanan saya dimulai dari rasa penasaran sederhana:
                  bagaimana sebuah foto bisa membuat orang tersenyum
                  bertahun-tahun kemudian. Dari situlah saya menekuni
                  fotografi — belajar cahaya, momen, dan yang paling penting:
                  manusia.
                </p>
                <p>
                  Gaya saya <strong className="text-ink">natural dan candid</strong>.
                  Kamu tidak perlu bisa bergaya — cukup jadi diri sendiri,
                  sisanya urusan saya. Wilayah layanan utama{" "}
                  <strong className="text-ink">Depok &amp; Jabodetabek</strong>,
                  terbuka untuk perjalanan ke luar kota.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.34em] text-muted">
              Layanan
            </p>
          </Reveal>
          <ul className="border-t border-line">
            {SERVICES.map((s, i) => (
              <li key={s.no} className={i > 0 ? "border-t border-line" : ""}>
                <Reveal delay={(i % 6) * 50}>
                  <div className="flex items-baseline gap-5 py-5 md:gap-8">
                    <span className="w-10 shrink-0 text-sm tracking-[0.2em] text-muted">
                      {s.no}
                    </span>
                    <span className="font-display flex-1 text-2xl tracking-wide uppercase md:text-4xl">
                      {s.label}
                    </span>
                    <span className="hidden text-sm text-muted sm:block">
                      {s.desc}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="mt-14 flex flex-wrap items-center gap-6">
          <a
            href={WA_GREETING}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink px-8 py-4 text-[12px] font-bold tracking-[0.18em] text-paper uppercase transition-transform hover:scale-[1.03]"
          >
            Diskusi Kebutuhanmu
          </a>
          <Link
            href="/galeri"
            className="text-[12px] font-semibold tracking-[0.18em] uppercase underline underline-offset-4 transition-colors hover:text-muted"
          >
            ← Lihat karya saya
          </Link>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
