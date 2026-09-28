"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "Berapa harga jasa foto wedding?",
    a: "Harga tergantung paket dan durasi acara. Paket wedding mulai dari dokumentasi akad hingga full-day resepsi. Chat via WhatsApp untuk pricelist lengkap — link ada di halaman Kontak.",
  },
  {
    q: "Bagaimana cara booking?",
    a: "Hubungi via WhatsApp di 0858 1105 3787, ceritakan tanggal dan konsep acaramu, lalu amankan tanggal dengan DP. Semakin cepat booking, semakin aman tanggalmu.",
  },
  {
    q: "Berapa lama hasil foto/video jadi?",
    a: "Foto preview kilat biasanya 2–3 hari setelah acara. Album final 2–4 minggu tergantung paket. Video cinematic 3–6 minggu.",
  },
  {
    q: "Apakah melayani di luar kota?",
    a: "Ya! Berbasis di Depok/Jabodetabek dan siap terbang ke seluruh Indonesia. Biaya akomodasi menyesuaikan lokasi.",
  },
  {
    q: "Apakah file mentah (RAW) diberikan?",
    a: "File final yang sudah diedit diberikan dalam resolusi penuh. File RAW bisa didiskusikan untuk paket tertentu.",
  },
  {
    q: "Bisa foto prewedding outdoor?",
    a: "Sangat bisa — prewedding outdoor/sunset adalah salah satu spesialisasi. Kita diskusikan lokasi dan konsep yang paling cocok untuk kalian.",
  },
];

interface Msg {
  from: "bot" | "user";
  text: string;
}

/** Chatbox FAQ — jawaban otomatis tanpa biaya AI (PRD T-16). */
export default function Chatbox() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Halo! Ada yang bisa saya bantu? Pilih pertanyaan di bawah." },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/masuk") || pathname.startsWith("/auth")) {
    return null;
  }

  function ask(qa: QA) {
    setMsgs((m) => [...m, { from: "user", text: qa.q }]);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: qa.a }]);
    }, 450);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
      {open && (
        <div className="mb-3 flex h-[420px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden border border-white/15 bg-[#111] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-[11px] tracking-[0.25em] text-white/50 uppercase">Tanya jawab</p>
              <p className="font-display text-lg text-white uppercase">Asisten MRR</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="flex h-9 w-9 items-center justify-center border border-white/20 text-xl text-white hover:bg-white hover:text-black"
            >
              ×
            </button>
          </div>
          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                    m.from === "user" ? "bg-white text-black" : "bg-white/10 text-white"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <div className="max-h-40 overflow-y-auto border-t border-white/10 p-3">
            <p className="mb-2 px-1 text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Pertanyaan populer
            </p>
            <div className="flex flex-wrap gap-2">
              {FAQS.map((qa) => (
                <button
                  key={qa.q}
                  onClick={() => ask(qa)}
                  className="border border-white/20 px-3 py-1.5 text-left text-xs text-white/80 transition-colors hover:border-white hover:text-white"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Tutup chat" : "Buka chat FAQ"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5D90A] text-black shadow-xl transition-transform hover:scale-105"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
