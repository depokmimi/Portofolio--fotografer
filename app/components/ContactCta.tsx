import Link from "next/link";
import Reveal from "./Reveal";

const contacts = [
  { no: "01", label: "WhatsApp", value: "0858 1105 3787", href: "https://wa.me/6285811053787" },
  { no: "02", label: "Instagram", value: "@muramsyah", href: "https://instagram.com/muramsyah" },
  { no: "03", label: "Email", value: "me@muramsyah.biz.id", href: "mailto:me@muramsyah.biz.id" },
];

export default function ContactCta() {
  return (
    <section className="border-t border-line px-5 py-20 md:px-10 md:py-28" aria-labelledby="hubungi">
      <Reveal>
        <h2 id="hubungi" className="font-display max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          Punya momen spesial? Mari abadikan.
        </h2>
        <p className="mt-4 text-muted">Fast respon 08.00–21.00 WIB</p>
      </Reveal>
      <div className="mt-10 border-t border-line">
        {contacts.map((c, i) => (
          <Reveal key={c.no} delay={i * 0.08}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="group flex items-baseline gap-5 border-b border-line py-6 transition-colors md:gap-10"
            >
              <span className="text-[12px] tracking-[0.2em] text-muted">{c.no}</span>
              <span className="font-display text-3xl transition-transform duration-300 group-hover:translate-x-2 md:text-5xl">
                {c.label}
              </span>
              <span className="ml-auto text-sm text-muted md:text-base">{c.value}</span>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <Link
          href="/kontak"
          className="mt-10 inline-block bg-accent px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.03]"
        >
          Halaman Kontak
        </Link>
      </Reveal>
    </section>
  );
}
