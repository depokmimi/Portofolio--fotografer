import Reveal from "./Reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  desc?: string;
}

/** Kepala halaman: label kecil + judul raksasa Anton uppercase. */
export default function PageHeader({ eyebrow, title, desc }: PageHeaderProps) {
  return (
    <div>
      <div className="flex justify-between border-b border-line pb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
        <span>{eyebrow}</span>
        <span>Portfolio / 2026</span>
      </div>
      <Reveal>
        <h1 className="font-display mt-10 text-[15vw] leading-[0.88] uppercase md:text-[9vw]">
          {title}
        </h1>
      </Reveal>
      {desc && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-muted">
            {desc}
          </p>
        </Reveal>
      )}
    </div>
  );
}
