// Data dummy — BELUM wiring Supabase/Drive (fase lain).
// Foto contoh memakai picsum.photos dengan seed agar stabil.

export const PHOTOGRAPHER_NAME = "Muhamad Ramdhani Rachmansyah";
export const PHOTOGRAPHER_SHORT = "Muhamad Ramdhani";

export const PHONE_DISPLAY = "085811053787";
export const PHONE_INTL = "6285811053787";
export const EMAIL = "me@muramsyah.biz.id";
export const INSTAGRAM_HANDLE = "@muramsyah";
export const INSTAGRAM_LINK = "https://instagram.com/muramsyah";
export const RESPONSE_HOURS = "Fast respon 08.00–21.00 WIB";

export const waLink = (text: string) =>
  `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;

export const WA_GREETING = waLink(
  "Halo! Saya lihat portofolio fotonya, mau tanya-tanya dulu boleh?"
);

export type Category =
  | "Wedding"
  | "Prewedding"
  | "Portrait"
  | "Wisuda"
  | "Keluarga"
  | "Event";

export const CATEGORIES: Array<"Semua" | Category> = [
  "Semua",
  "Wedding",
  "Prewedding",
  "Portrait",
  "Wisuda",
  "Keluarga",
  "Event",
];

export interface Photo {
  id: string;
  seed: string;
  title: string;
  category: Category;
  /** rasio asli untuk layout masonry */
  w: number;
  h: number;
}

export const PHOTOS: Photo[] = [
  { id: "w1", seed: "mura-wed1", title: "Janji Suci di Senja Hari", category: "Wedding", w: 800, h: 1000 },
  { id: "w2", seed: "mura-wed2", title: "Genggaman Pertama", category: "Wedding", w: 1000, h: 750 },
  { id: "w3", seed: "mura-wed3", title: "Senyum Pengantin", category: "Wedding", w: 800, h: 1000 },
  { id: "p1", seed: "mura-pre1", title: "Cerita Kita Berdua", category: "Prewedding", w: 1000, h: 750 },
  { id: "p2", seed: "mura-pre2", title: "Langkah Bersama", category: "Prewedding", w: 800, h: 1000 },
  { id: "p3", seed: "mura-pre3", title: "Tawa Lepas", category: "Prewedding", w: 1000, h: 750 },
  { id: "r1", seed: "mura-por1", title: "Tatapan", category: "Portrait", w: 800, h: 1000 },
  { id: "r2", seed: "mura-por2", title: "Sisi Lain", category: "Portrait", w: 800, h: 1000 },
  { id: "r3", seed: "mura-por3", title: "Cahaya Jendela", category: "Portrait", w: 1000, h: 750 },
  { id: "s1", seed: "mura-wis1", title: "Toga & Mimpi", category: "Wisuda", w: 800, h: 1000 },
  { id: "s2", seed: "mura-wis2", title: "Hari Kelulusan", category: "Wisuda", w: 1000, h: 750 },
  { id: "f1", seed: "mura-fam1", title: "Hangat Keluarga", category: "Keluarga", w: 1000, h: 750 },
  { id: "f2", seed: "mura-fam2", title: "Pelukan Ayah", category: "Keluarga", w: 800, h: 1000 },
  { id: "e1", seed: "mura-evt1", title: "Panggung Meriah", category: "Event", w: 1000, h: 750 },
  { id: "e2", seed: "mura-evt2", title: "Momen Puncak", category: "Event", w: 800, h: 1000 },
  { id: "e3", seed: "mura-evt3", title: "Sorak Penonton", category: "Event", w: 1000, h: 750 },
];

export const photoUrl = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const HERO_SEED = "mura-hero";
export const OWNER_SEED = "mura-owner";

// ---------- FAQ chatbox (tanpa AI berbayar, pencocokan kata kunci) ----------

export interface Faq {
  keys: string[];
  answer: string;
}

export const CHAT_GREETING =
  "Halo! Saya asisten virtual. Mau tanya soal layanan foto, harga, atau cara booking? 😊";

export const CHAT_FALLBACK =
  "Hmm, saya kurang paham maksudnya 😅 Biar lebih jelas dan cepat, langsung chat saja ya 👇";

export const FAQS: Faq[] = [
  {
    keys: ["halo", "hai", "hello", "pagi", "siang", "sore", "malam", "assalamu"],
    answer:
      "Halo juga! Senang bisa membantu 😊 Mau tanya soal layanan, harga, atau cara booking? Atau pilih tombol cepat di bawah ya.",
  },
  {
    keys: ["harga", "biaya", "berapa", "price", "tarif", "paket", "mahar", "budget"],
    answer:
      "Untuk harga, tiap kebutuhan beda-beda — wedding, prewedding, wisuda, dan event punya paket masing-masing. Biar dapat penawaran yang paling pas, langsung chat WhatsApp saja ya, nanti dibantu hitung sesuai kebutuhan kamu 📩",
  },
  {
    keys: ["layanan", "jasa", "foto apa", "bisa apa", "jenis", "wedding", "nikah", "prewedding", "wisuda", "portrait", "event", "acara", "keluarga", "produk"],
    answer:
      "Layanannya lengkap: 📸 Wedding, Prewedding, Portrait, Wisuda, Keluarga, sampai dokumentasi Event. Bisa foto saja atau paket foto + video sinematik. Mau yang mana?",
  },
  {
    keys: ["booking", "pesan", "order", "jadwal", "cara", "daftar", "book", "sewa"],
    answer:
      "Cara booking gampang banget:\n1️⃣ Chat WhatsApp dulu, ceritakan tanggal & kebutuhanmu\n2️⃣ Kita diskusi konsep & paket\n3️⃣ Amankan tanggal dengan tanda jadi\n4️⃣ Beres! Tinggal tunggu hari-H 📅",
  },
  {
    keys: ["lokasi", "daerah", "dimana", "domisili", "tinggal", "kota", "luar kota", "jabodetabek", "depok"],
    answer:
      "Berbasis di Depok dan melayani area Jabodetabek. Untuk luar kota / luar pulau juga bisa banget, tinggal diskusi jadwal dan akomodasinya via WhatsApp ya ✈️",
  },
  {
    keys: ["hasil", "jadi", "kapan", "berapa lama", "durasi", "proses", "editing"],
    answer:
      "Setiap hasil melewati kurasi dan editing warna premium dulu. Biasanya foto jadi dalam 7–14 hari kerja setelah acara. Ada sneak peek beberapa foto pilihan lebih cepat biar nggak penasaran 📷",
  },
  {
    keys: ["bayar", "pembayaran", "dp", "tanda jadi", "transfer", "cash", "uang muka"],
    answer:
      "Untuk mengamankan tanggal, biasanya ada tanda jadi (DP) dulu. Sisanya dilunasi paling lambat di hari-H. Detail nominal dan skemanya bisa diobrolin santai via WhatsApp ya 💬",
  },
  {
    keys: ["video", "sinematik", "cinematic", "dokumentasi"],
    answer:
      "Bisa! Tersedia paket foto + video sinematik biar momenmu terdokumentasi lengkap — teaser singkat buat media sosial juga termasuk 🎬",
  },
  {
    keys: ["cetak", "album", "print", "bingkai"],
    answer:
      "Tersedia opsi cetak dan album premium — cocok buat kenang-kenangan atau kado. Tanya-tanya dulu boleh banget via WhatsApp 🖼️",
  },
  {
    keys: ["kontak", "hubungi", "whatsapp", "wa", "instagram", "ig", "telepon", "nomor", "hp"],
    answer:
      `Bisa hubungi langsung:\n📱 WhatsApp: ${PHONE_DISPLAY}\n📸 Instagram: ${INSTAGRAM_HANDLE}\n${RESPONSE_HOURS}`,
  },
  {
    keys: ["jam", "buka", "respon", "fast", "kapan dibalas"],
    answer: `Chat direspon cepat, ${RESPONSE_HOURS.toLowerCase()}. Di luar jam itu tetap boleh chat, dibalas secepatnya ya 🙏`,
  },
  {
    keys: ["pengalaman", "lama", "profesional", "percaya", "portofolio", "siapa"],
    answer:
      "Fotografer profesional dengan gaya natural dan candid — fokus menangkap momen apa adanya, bukan pose kaku. Intip galerinya biar makin yakin 😉",
  },
  {
    keys: ["terima kasih", "makasih", "thanks", "thank", "oke", "ok", "siap"],
    answer: "Sama-sama! Senang bisa membantu 😊 Kalau ada yang mau ditanyakan lagi, jangan ragu chat ya.",
  },
];

/** Kembalikan jawaban FAQ yang cocok, atau null kalau tidak dikenali. */
export function findFaqAnswer(question: string): string | null {
  const q = question.toLowerCase();
  for (const faq of FAQS) {
    if (faq.keys.some((k) => q.includes(k))) return faq.answer;
  }
  return null;
}

export const QUICK_REPLIES = ["💰 Harga", "📸 Layanan", "📅 Cara Booking"];
