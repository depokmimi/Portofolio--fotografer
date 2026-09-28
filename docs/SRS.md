# SRS — Website Portofolio Fotografer

**Versi:** 2.0
**Tanggal:** 2026-09-28
**Acuan:** PRD v2.0, SRS v1.0

---

## 1. Pendahuluan

Dokumen ini merinci kebutuhan perangkat lunak hasil rebuild (v2): kebutuhan fungsional (FR), kebutuhan non-fungsional (NFR), dan batasan sistem. Backend v1 dipakai ulang tanpa perubahan; yang baru adalah seluruh frontend + standar kualitas dari skill AI.

## 2. Kebutuhan Fungsional

Prioritas: **M** = Must (wajib), **S** = Should, **C** = Could (NANTI).

### 2.1 Autentikasi (khusus pemilik) — PAKAI ULANG v1

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Sistem menyediakan halaman `/masuk` dengan tombol Login **Google OAuth** (via Supabase Auth) | M |
| FR-02 | Hanya email pemilik (`NEXT_PUBLIC_OWNER_EMAIL`) yang bisa masuk; email lain ditolak dengan pesan jelas | M |
| FR-03 | Pemilik bisa keluar (logout); sesi berakhir otomatis | M |

### 2.2 Pengelolaan karya (pemilik, setelah login) — PAKAI ULANG v1

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-04 | Pemilik bisa **upload foto** (JPG/PNG/WebP) dan **video** (MP4) ke Google Drive | M |
| FR-05 | Upload memakai chunked/resumable agar file besar & koneksi HP tidak stabil tetap bisa | M |
| FR-06 | Setiap karya wajib punya judul; opsional: kategori & deskripsi singkat | M |
| FR-07 | Pemilik bisa ubah judul/kategori karya | M |
| FR-08 | Pemilik bisa hapus karya (menghapus file Drive + baris `works`) | M |
| FR-09 | Pemilik bisa mengatur urutan tampil karya (`position`: naik/turun) | M |
| FR-10 | Pemilik bisa menandai satu karya video sebagai **showreel utama** (`is_featured`) | M |
| FR-11 | Halaman admin menampilkan sisa kuota Google Drive | S |

### 2.3 Galeri publik (tanpa login)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-12 | Pengunjung melihat galeri grid foto & video tanpa login | M |
| FR-13 | Filter karya berdasarkan kategori | M |
| FR-14 | Klik karya membuka **lightbox**: layar penuh + judul + navigasi sebelum/berikutnya + tutup via Esc | M |
| FR-15 | Video bisa diputar langsung di lightbox | M |
| FR-16 | Gambar memakai `next/image` + lazy-load + thumbnail Drive; fallback berlapis bila thumbnail gagal | M |
| FR-17 | Bila Supabase tidak terjangkau, galeri memakai data dummy lokal agar halaman tidak kosong | M |

### 2.4 Halaman Video (tanpa login)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-18 | Satu **showreel besar** di atas (karya dengan `is_featured = true`; fallback: video pertama) | M |
| FR-19 | Daftar video di bawahnya; klik untuk ganti video yang diputar | M |
| FR-20 | Setiap video menampilkan judul, kategori, dan durasi bila tersedia | S |

### 2.5 Halaman statis

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-21 | Beranda: hero sinematik (nama besar + foto + CTA), cuplikan karya, tentang singkat, CTA kontak | M |
| FR-22 | Tentang: foto pemilik, biodata singkat, gaya & pengalaman fotografi, daftar layanan | M |
| FR-23 | Kontak: baris kontak besar bernomor (WhatsApp, Instagram, Email), jam respons | M |

### 2.6 Chatbox AI — PAKAI ULANG logika v1, UI baru

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-24 | Chatbox melayang di semua halaman publik, bisa dibuka/tutup | M |
| FR-25 | Menjawab pertanyaan umum: layanan, kisaran harga, cara booking, lokasi, durasi pengerjaan | M |
| FR-26 | Jawaban berbasis FAQ (bisa diubah pemilik tanpa coding) | M |
| FR-27 | Di luar pengetahuan / niat booking → arahkan ke tombol WhatsApp | M |
| FR-28 | Tidak meminta data pribadi pengunjung | M |

### 2.7 Tema & Motion

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-29 | Tema Editorial Bold; mode terang & gelap (satu tema per halaman, tidak belang) | M |
| FR-30 | Animasi sinematik: hero reveal berurutan, parallax, reveal-on-scroll, transisi antarhalaman (Motion) | M |
| FR-31 | Seluruh animasi di atas menghormati `prefers-reduced-motion` | M |

## 3. Kebutuhan Non-Fungsional

### 3.1 Keamanan — audit memakai Cybersecurity Skills (aman)

- NFR-01: Semua endpoint tulis (`POST/PATCH/DELETE`) cek sesi Supabase di server + cocokkan email pemilik (owner gate). RLS Supabase: publik read-only.
- NFR-02: Tidak ada pendaftaran publik; endpoint admin mengembalikan 401/403 untuk anonim.
- NFR-03: Kredensial (API key, refresh token Google) hanya di env server; tidak ada di bundle client.
- NFR-04: Validasi file di server: whitelist MIME (jpg/png/webp/mp4), batas ukuran per file.
- NFR-05: Rate-limit endpoint upload & chatbox (per IP per menit).
- NFR-06: Header keamanan: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, CSP dasar.
- NFR-07: Tidak ada secret/error stack trace yang bocor ke client di production.

### 3.2 Keandalan (kuat)

- NFR-08: Upload terputus bisa dilanjutkan (resumable).
- NFR-09: Galeri tetap tampil walau thumbnail Drive gagal (fallback berlapis) atau Supabase gagal (data dummy).
- NFR-10: Chatbox tetap bisa dibuka walau FAQ gagal dimuat (pesan fallback + tombol WhatsApp).
- NFR-11: Error tak terduga di production dilaporkan ke Sentry; pengguna melihat halaman error yang ramah.

### 3.3 Performa (tangkas) — standar Autoskills + Context7

- NFR-12: LCP < 2.5 dtk, INP < 200 mdtk, CLS < 0.1 (diukur Lighthouse mobile).
- NFR-13: Gambar responsif (`next/image`, `sizes`, `priority` hanya untuk hero); lazy-load di bawah fold.
- NFR-14: Video tidak preload/autoplay di grid; hanya diputar di showreel/lightbox.
- NFR-15: Animasi hanya `transform` & `opacity` (GPU-friendly); tanpa `window scroll` listener manual.
- NFR-16: Chatbox merespons < 1 detik (FAQ lokal).

### 3.4 Aksesibilitas — standar skill `accessibility` (Autoskills)

- NFR-17: Kontras teks WCAG AA minimum (4.5:1 isi, 3:1 teks besar) di kedua mode.
- NFR-18: Semua aksi bisa diakses keyboard; fokus terlihat; lightbox bisa Esc.
- NFR-19: `alt` deskriptif di setiap foto karya; label ARIA pada tombol ikon.
- NFR-20: `prefers-reduced-motion: reduce` menonaktifkan parallax, marquee, dan animasi loop.

### 3.5 SEO — standar skill `seo` (Autoskills)

- NFR-21: Title & meta description unik per halaman; Open Graph + Twitter Card.
- NFR-22: Satu `<h1>` per halaman; heading hierarkis; HTML semantik (`header`, `main`, `footer`, `nav`).
- NFR-23: `sitemap.xml` + `robots.txt`; URL kanonis.

### 3.6 Keterpeliharaan

- NFR-24: Komponen client terisolasi (`"use client"` hanya di daun interaktif); Server Component untuk layout statis.
- NFR-25: Satu sistem ikon per proyek; satu skala radius; satu warna aksen per halaman (aturan Taste Skill).
- NFR-26: Knowledge graph codebase (Graphify) diperbarui tiap rilis besar.

## 4. Kebutuhan Antarmuka

- INT-01: Google OAuth via Supabase Auth (tombol resmi "Masuk dengan Google").
- INT-02: Google Drive API v3 untuk upload, hapus, thumbnail (pakai ulang).
- INT-03: Deep link WhatsApp `https://wa.me/6285811053787?text=...`, Instagram `https://instagram.com/muramsyah`, `mailto:me@muramsyah.biz.id`.
- INT-04: Sentry DSN (env server) untuk laporan error production.

## 5. Batasan

- B-01: Satu pemilik, satu folder Google Drive (kuota mengikuti akun pemilik).
- B-02: Tidak ada pembayaran/booking online.
- B-03: Chatbox tahap 1 tanpa LLM berbayar.
- B-04: Bahasa antarmuka: Indonesia.
- B-05: Backend (skema `works`, API, alur OAuth Drive) TIDAK diubah di v2.
- B-06: Tetap hosting di Vercel (opsi Cloudflare dicatat untuk NANTI).
