import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 pt-14 pb-8 md:px-10">
      <p className="font-script text-center text-[13vw] leading-none md:text-[6vw]">
        Muhamad Ramdhani
      </p>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-muted sm:flex-row">
        <span>© 2026 muramsyah</span>
        <div className="flex gap-6">
          <a
            href="https://instagram.com/muramsyah"
            target="_blank"
            rel="noopener"
            className="transition-colors hover:text-ink"
          >
            Instagram
          </a>
          <a
            href="https://wa.me/6285811053787"
            target="_blank"
            rel="noopener"
            className="transition-colors hover:text-ink"
          >
            WhatsApp
          </a>
          <Link href="/masuk" className="transition-colors hover:text-ink">
            Area Pemilik
          </Link>
        </div>
      </div>
    </footer>
  );
}
