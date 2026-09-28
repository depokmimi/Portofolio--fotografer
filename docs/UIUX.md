# UI/UX — Website Portofolio Fotografer

**Versi:** 2.0
**Tanggal:** 2026-09-28
**Acuan:** PRD v2.0, UIUX v1.0
**Skill:** Taste Skill (`design-taste-frontend`) + UI UX Pro Max

---

## 0. Design Read (Taste Skill §0)

**"Reading this as: photographer portfolio for prospective clients, with an editorial-bold magazine language, leaning toward Tailwind v4 + Motion + asymmetric print-inspired layouts."**

### Dials

| Dial | Nilai | Alasan |
|---|---|---|
| DESIGN_VARIANCE | **8** | Portfolio kreatif: asimetris, layout majalah |
| MOTION_INTENSITY | **7** | Sinematik tapi bermakna: reveal, parallax, transisi halaman |
| VISUAL_DENSITY | **3** | Galeri seni: lega, foto sebagai statement |

### Anti-Default Discipline

Dilarang: gradien ungu AI, hero centered + dark mesh, 3 kartu fitur sejajar, glassmorphism di semua elemen, Inter sebagai default, emoji di UI.

## 1. Prinsip Desain

1. **Foto adalah desainnya** — halaman dibangun mengelilingi karya, bukan sebaliknya.
2. **Berani & ritmis** — tipografi raksasa, layout asimetris, jeda yang dramatis.
3. **Satu aksi per layar** — tiap halaman punya satu tujuan jelas.
4. **Gerak yang bermakna** — setiap animasi menjawab "apa yang dikomunikasikan" (hierarki / cerita / feedback).
5. **Mobile-first** — asimetris desktop runtuh menjadi satu kolom rapi di HP.

## 2. Design Tokens

| Token | Terang | Gelap |
|---|---|---|
| `--paper` (bg) | `#f4f1ea` hangat | `#11110f` pekat |
| `--ink` (teks) | `#11110f` | `#f4f1ea` |
| `--muted` | `#625f58` | `#aaa69e` |
| `--line` (garis) | `#1c1c18` | `#ded8ce` |
| `--accent` (SATU aksen) | `#ec422f` merah editorial | `#ff5a42` |
| `--acid` (aksen kedua, hemat) | `#d9f36a` | `#d9f36a` |
| `--panel` | `#e9e5dc` | `#1c1b18` |

**Aturan kunci (Color Consistency Lock):** satu aksen per halaman (`--accent`). `--acid` hanya untuk badge kecil ("Available for projects"). Tidak ada aksen ketiga.

### Tipografi

- **Display:** serif editorial tebal (Bodoni/Didot via `next/font`) — **pengecualian serif yang dibenarkan**: brief-nya genuinely editorial/majalah.
- **Isi:** sans bersih via `next/font` (`display: swap`).
- **Aturan:** headline maks 2 baris; italic + descender (`y g j p q`) wajib `leading-[1.1]` + `pb-1` agar tidak kepotong.

### Bentuk & Bayangan

- **Radius:** tajam — `0–4px` di seluruh proyek (Shape Consistency Lock).
- **Bayangan:** tint sesuai background; tidak ada drop-shadow hitam murni di mode terang.

## 3. Struktur Navigasi

```
Header (sticky, ≤72px, 1 baris di desktop):
[ MRR monogram ]  Beranda | Galeri | Video | Tentang | Kontak    [ Area Pemilik ] [🌗]

Mobile: hamburger → menu fullscreen.

Footer:
© 2026 Muhamad Ramdhani Rachmansyah · Instagram @muramsyah · WA 085811053787 · me@muramsyah.biz.id
```

## 4. Halaman

### 4.1 Beranda (`/`)

1. **Bar edisi** — `Fotografi • Indonesia | Portfolio / 2026` (border-b).
2. **Hero split asimetris** (bukan centered): kiri nama raksasa 3 baris ("Muhamad / *Ramdhani* / Rachmansyah"), kanan foto portrait dengan parallax + clip reveal. Subtext ≤ 20 kata. CTA: **satu label per niat** — [Lihat Galeri] [Chat WhatsApp].
3. **Pita kategori** — marquee SATU SAJA per halaman: `PORTRAIT — WEDDING — EDITORIAL — ...`.
4. **Karya pilihan** — 6 karya, grid editorial bervariasi (bukan 3 kolom monoton); tombol `Lihat Galeri →` (label SAMA dengan hero — satu niat satu label).
5. **Tentang singkat** — panel invert sekali (color block yang disengaja, bukan belang acak).
6. **Kontak CTA** — headline raksasa "Let's make *something.*" + baris kontak bernomor.

### 4.2 Galeri (`/galeri`)

- Filter kategori sebagai chip; grid editorial dengan ritme (variasi rasio 4:3 / 16:9 / portrait).
- Hover (desktop): judul muncul; tap (HP): langsung buka lightbox.
- **Lightbox:** fullscreen, judul + kategori, ‹ ›, Esc, tombol "Tanya via WhatsApp" (teks otomatis = judul karya).

### 4.3 Video (`/video`)

- **Showreel besar** di atas (16:9, karya `is_featured`).
- Daftar video di bawah: thumbnail + judul + durasi; klik mengganti showreel.

### 4.4 Tentang (`/tentang`)

- Portrait pemilik + nama + paragraf gaya (dokumenter × editorial) + daftar layanan (maks 6) + wilayah layanan.

### 4.5 Kontak (`/kontak`)

- Tiga baris besar bernomor: `01 WhatsApp 085811053787`, `02 Instagram @muramsyah`, `03 Email me@muramsyah.biz.id` — efek sapuan aksen saat hover/tap.
- Jam respons: "Fast respon 08.00–21.00 WIB".

### 4.6 Masuk (`/masuk`) — pakai ulang v1

Kartu tengah: monogram, "Area Pemilik", tombol "Masuk dengan Google".

### 4.7 Admin (`/admin`) — pakai ulang v1, UI diselaraskan

Daftar karya (thumbnail + judul + kategori), tombol Upload (progress bar), kontrol urutan (naik/turun), tandai showreel (bintang), hapus (konfirmasi), meter kuota Drive.

## 5. Chatbox AI

- Tombol melayang kanan bawah (ikon chat, aksen); jendela 360px (HP: sheet bawah).
- Sapaan: "Halo! Saya asisten virtual. Mau tanya soal layanan, harga, atau cara booking?"
- Quick replies: [Harga] [Layanan] [Cara Booking].
- Fallback: "Saya kurang paham, langsung chat saja ya 👇" + tombol WhatsApp.

## 6. Motion Design (Motion)

| Pola | Dipakai di | Komunikasi |
|---|---|---|
| Reveal berurutan (spring) | Judul hero per baris | Hierarki + drama |
| Clip-path reveal | Foto hero | Pengungkapan karya |
| Parallax (`useScroll`/`useTransform`) | Foto hero | Kedalaman |
| `whileInView` stagger | Section & grid | Ritme scroll |
| Badge melayang (`Float`) | "Available for projects" | Hidup, tidak statis |
| Transisi halaman | Antar rute | Keutuhan pengalaman |
| Navbar sembunyi saat scroll turun | Header | Fokus ke konten |

**Larangan:** `window.addEventListener("scroll")` manual; animasi `top/left/width/height`; marquee lebih dari 1; semua animasi non-esensial mati saat `prefers-reduced-motion`.

## 7. Aturan Anti-Slop (dipakai saat QA)

- [ ] Eyebrow ≤ 1 per 3 section
- [ ] Satu label CTA per niat per halaman
- [ ] Tidak ada layout section yang repetitif (≥ 4 keluarga layout per halaman)
- [ ] Hero muat viewport; `pt` hero ≤ `pt-24`; pakai `min-h-[100dvh]` bukan `h-screen`
- [ ] Kontras tombol ≥ 4.5:1; teks CTA tidak wrap di desktop
- [ ] Copy audit: tidak ada kalimat rusak/halusinasi AI
- [ ] Satu tema per halaman (tidak belang terang-gelap acak)
- [ ] Collapse mobile eksplisit per section

## 8. Responsivitas

- HP (<768px): semua asimetris → satu kolom; galeri 2 kolom; hero teks mengecil; chatbox jadi sheet bawah.
- Breakpoint standar: `sm 640 / md 768 / lg 1024 / xl 1280`.

## 9. Aksesibilitas & Detail

- Kontras WCAG AA; fokus keyboard terlihat; `alt` deskriptif; label ARIA tombol ikon.
- Bahasa Indonesia; sapaan hangat ("Anda" formal, "kamu" di chatbox).
