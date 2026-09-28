import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import {
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
  PHONE_DISPLAY,
  PHONE_INTL,
  RESPONSE_HOURS,
  WA_GREETING,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak — Muhamad Ramdhani Rachmansyah",
  description:
    "Hubungi Muhamad Ramdhani Rachmansyah untuk booking jasa fotografi: WhatsApp, Instagram, telepon, dan email.",
};

const CONTACTS = [
  {
    no: "01",
    label: "WhatsApp",
    value: "0858 1105 3787",
    href: WA_GREETING,
  },
  {
    no: "02",
    label: "Telepon",
    value: "0858 1105 3787",
    href: `tel:+${PHONE_INTL}`,
  },
  {
    no: "03",
    label: "Instagram",
    value: INSTAGRAM_HANDLE,
    href: INSTAGRAM_LINK,
  },
  {
    no: "04",
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
];

export default function KontakPage() {
  return (
    <>
      <Nav />
      <main className="px-5 pt-24 pb-16 md:px-10 md:pt-28 md:pb-24">
        <PageHeader
          eyebrow="Kontak"
          title="Hubungi Saya"
          desc="Punya proyek, acara, atau cerita yang ingin divisualkan? Ceritakan kebutuhanmu dan mari susun arahnya bersama."
        />

        <ul className="mt-12 border-t border-line">
          {CONTACTS.map((c, i) => (
            <li key={c.no} className={i > 0 ? "border-t border-line" : ""}>
              <Reveal delay={i * 60}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener" : undefined}
                  className="group flex items-center gap-5 py-6 md:gap-8"
                >
                  <span className="w-10 shrink-0 text-sm tracking-[0.2em] text-muted">
                    {c.no}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[11px] uppercase tracking-[0.28em] text-muted">
                      {c.label}
                    </span>
                    <span className="font-display mt-1 block text-[7vw] leading-none tracking-wide uppercase transition-transform duration-500 group-hover:translate-x-2 md:text-[3.5vw]">
                      {c.value}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-3xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-2"
                  >
                    ↗
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12">
          <p className="text-sm text-muted">{RESPONSE_HOURS}. {PHONE_DISPLAY}</p>
          <a
            href={WA_GREETING}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-ink px-10 py-4 text-[12px] font-bold tracking-[0.18em] text-paper uppercase transition-transform hover:scale-[1.03]"
          >
            Mulai Chat WhatsApp
          </a>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
