"use client";

import Reveal from "./Reveal";

const contacts = [
  {
    no: "01",
    label: "WhatsApp",
    value: "0858 1105 3787",
    href: "https://wa.me/6285811053787?text=Halo%2C%20saya%20tertarik%20dengan%20jasa%20fotografi%20Anda.",
  },
  {
    no: "02",
    label: "Instagram",
    value: "@muramsyah",
    href: "https://instagram.com/muramsyah",
  },
  {
    no: "03",
    label: "Email",
    value: "me@muramsyah.biz.id",
    href: "mailto:me@muramsyah.biz.id",
  },
];

export default function ContactCta() {
  return (
    <section className="border-t border-line px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.34em] text-muted">
          Kontak
        </p>
        <h2 className="font-display text-[13vw] leading-[0.9] uppercase md:text-[6vw]">
          Mari Bekerja
          <br />
          Sama
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
          Ceritakan momen yang ingin kamu abadikan — aku akan bantu
          mewujudkannya.
        </p>
      </Reveal>
      <ul className="mt-10 border-t border-line">
        {contacts.map((c, i) => (
          <li key={c.no} className={i > 0 ? "border-t border-line" : ""}>
            <Reveal delay={i * 60}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener" : undefined}
                className="group flex items-center gap-5 py-5 md:gap-8 md:py-6"
              >
                <span className="w-10 shrink-0 text-sm tracking-[0.2em] text-muted">
                  {c.no}
                </span>
                <span className="flex-1">
                  <span className="block text-[11px] uppercase tracking-[0.28em] text-muted">
                    {c.label}
                  </span>
                  <span className="font-display mt-1 block text-2xl tracking-wide uppercase transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                    {c.value}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-2"
                >
                  ↗
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
