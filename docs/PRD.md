# PRD — Website Portofolio Fotografer

**Versi:** 2.0
**Tanggal:** 2026-09-28
**Pemilik:** Muhamad Ramdhani Rachmansyah
**Acuan:** PRD v1.0 (2026-09-26)

---

## 1. Ringkasan

Rebuild total (dari nol) website portofolio fotografer milik **Muhamad Ramdhani Rachmansyah** dengan standar kualitas yang jauh lebih tinggi. Frontend ditulis ulang dari awal memakai seluruh skill AI yang terpasang (Taste, UI UX Pro Max, Framer Motion/Motion, Autoskills, Context7, dsb.); **backend dipakai ulang apa adanya** (Supabase Auth + tabel `works`, Google Drive OAuth, API upload) karena sudah terbukti jalan.

Tema **Dark Monokrom Luxury** (disetujui pemilik 2026-09-28 via referensi Instagram). Hasil akhir: situs yang terasa hidup (animasi sinematik), anti-generik, cepat, aman, dan mudah dikelola pemilik dari HP.

## 2. Latar Belakang & Masalah

- v1 sudah live dan berfungsi, tapi dibangun bertahap dengan banyak tambalan → kode frontend tidak konsisten, ada pola desain generik ("AI slop"), dan standar aksesibilitas/SEO belum sistematis.
- Pemilik meminta seluruh skill AI yang terpasang dipakai penuh — paling efektif dengan membangun ulang frontend dari nol mengikuti panduan tiap skill sejak baris pertama.
- Backend v1 (login Google, tabel `works` Supabase, upload Drive) sudah stabil → dipakai ulang tanpa perubahan.

## 3. Tujuan

1. Frontend baru 100% dengan kualitas desain setara standar Awwwards (arah dark-monokrom-luxury).
2. Semua 12 skill terpasang dipakai pada tempatnya (lihat §8).
3. Backend v1 dipakai ulang tanpa perubahan (nol risiko regresi data).
4. Skor Lighthouse ≥ 90 di semua kategori pada halaman publik (mobile).
5. Pemilik tetap bisa upload/kelola karya dari HP seperti sebelumnya.

## 4. Pengguna

| Pengguna | Kebutuhan |
|---|---|
| Pengunjung / calon klien | Lihat galeri & video, baca profil, tanya via chatbox, hubungi via WhatsApp/Instagram — dengan pengalaman yang hidup & mulus |
| Pemilik (Muhamad Ramdhani Rachmansyah) | Login Google, upload foto/video, atur urutan & kategori, pilih showreel utama, hapus karya |

## 5. Ruang Lingkup

### Masuk (v2)
- F-01 Halaman publik: Beranda, Galeri, **Video** (showreel + daftar video), Tentang, Kontak
- F-02 Login Google khusus pemilik (pakai ulang `/masuk` + `/auth/callback` v1)
- F-03 Upload foto & video oleh pemilik ke Google Drive (pakai ulang API v1)
- F-04 Kelola karya: tambah, ubah judul/kategori, hapus, **atur urutan tampil** (`position`), **pilih showreel utama** (`is_featured`)
- F-05 Galeri publik: grid editorial, filter kategori, lightbox fullscreen
- F-06 Halaman Video: 1 showreel besar (dari karya `is_featured`) + daftar 6+ video yang bisa diklik
- F-07 Halaman Tentang: profil, foto pemilik, gaya fotografi, layanan
- F-08 Halaman Kontak: baris kontak besar bernomor (WhatsApp, Instagram, Email) + jam respons
- F-09 Chatbox AI FAQ (tanpa biaya, tahap 1) — logika v1 dipakai ulang, UI ditulis ulang
- F-10 Tema Dark Monokrom Luxury (hitam/charcoal, foto B&W sinematik, headline uppercase raksasa) + animasi sinematik (Motion)
- F-11 SEO penuh: metadata, Open Graph, sitemap, semantic HTML
- F-12 Aksesibilitas: kontras WCAG AA, fokus keyboard, `prefers-reduced-motion`, alt deskriptif
- F-13 Monitoring error via Sentry (laporan error produksi otomatis)

### Tidak Masuk (NANTI / di luar lingkup)
- Sistem booking & pembayaran online
- Komentar / like / akun pengunjung
- Multi-fotografer
- Blog / artikel
- Migrasi hosting ke Cloudflare (tetap Vercel)
- Integrasi Composio ke 1000+ aplikasi (belum ada kebutuhan)
- Datadog APM penuh (butuh akun & setup terpisah)

## 6. Alur Utama

**Pengunjung:** Buka website → hero sinematik → jelajah galeri/video → filter kategori / buka lightbox → tanya via chatbox AI → klik WhatsApp untuk booking.

**Pemilik:** Klik "Area Pemilik" → login Google → halaman admin → upload foto/video → isi judul & kategori → atur urutan / tandai showreel → karya langsung tampil di galeri publik.

## 7. Persyaratan Non-Fungsional

- **Aman:** owner gate di server untuk semua endpoint tulis; RLS Supabase; validasi file di server; rate-limit upload & chatbox; header keamanan.
- **Kuat:** fallback berlapis untuk thumbnail (Drive → file asli → ikon); galeri tidak kosong walau Supabase gagal (data dummy lokal).
- **Tangkas:** LCP < 2.5 dtk, INP < 200 ms, CLS < 0.1; gambar `next/image` + lazy-load; video tidak preload di grid.
- **Mobile-first:** mayoritas pengunjung dari HP; layout asimetris desktop collapse ke satu kolom rapi di HP.
- **Terpantau:** error produksi terkirim ke Sentry; halaman error yang ramah (bukan blank).

## 8. Pemakaian Skill (wajib)

| Skill | Dipakai untuk |
|---|---|
| Taste Skill | Arah desain, audit anti-generik, design read + dials (lihat UI/UX v2.0) |
| UI UX Pro Max | Design system: token, komponen, pola layout |
| Motion (Framer Motion) | Seluruh animasi: hero sinematik, reveal, parallax, transisi halaman |
| Autoskills (13 skill) | Best practice React/Next.js/Tailwind/TypeScript/Supabase/Node, frontend-design, **accessibility**, **SEO** |
| Context7 | Rujukan dokumentasi terbaru Next.js/React/Tailwind saat implementasi |
| Archify | Diagram arsitektur sistem di SDD v2.0 |
| Cybersecurity Skills | Audit keamanan: auth, RLS, validasi upload, header (lihat SRS §3.1) |
| Graphify | Knowledge graph codebase untuk perawatan jangka panjang |
| Sentry | Monitoring error produksi (skill `sentry-fix-issues`) |
| Datadog | Dokumen kesiapan observabilitas (implementasi penuh NANTI) |
| Composio | Dokumen opsi integrasi masa depan (NANTI) |
| Cloudflare | Dokumen opsi hosting/CDN alternatif (tetap Vercel di v2) |

## 9. Metrik Sukses

- Website v2 live (preview → production) dan bisa dibuka publik.
- Lighthouse mobile ≥ 90 (Performance, Accessibility, Best Practices, SEO).
- Pemilik bisa upload 1 foto & 1 video dari HP sampai tampil di galeri.
- Chatbox menjawab 5 pertanyaan umum dengan benar.
- Seluruh tombol WhatsApp, Instagram, Email berfungsi.
- Tidak ada error console pada alur utama.

## 10. Asumsi & Risiko

| # | Risiko | Mitigasi |
|---|---|---|
| 1 | Rebuild merusak yang sudah live | v2 dibangun di branch terpisah; production tidak disentuh sampai v2 lolos QA |
| 2 | Backend dipakai ulang tidak cocok dengan frontend baru | Kontrak API & skema `works` didokumentasikan di SDD v2.0; tidak diubah |
| 3 | Kuota Google Drive penuh | Meter kuota di halaman admin (pakai ulang) |
| 4 | Biaya AI mahal | Chatbox tetap FAQ tanpa biaya; Sentry paket gratis |

## 11. Identitas & Kontak Publik

- **Nama:** Muhamad Ramdhani Rachmansyah
- **Telepon / WhatsApp:** 085811053787 → https://wa.me/6285811053787
- **Instagram:** @muramsyah → https://instagram.com/muramsyah
- **Email:** me@muramsyah.biz.id
