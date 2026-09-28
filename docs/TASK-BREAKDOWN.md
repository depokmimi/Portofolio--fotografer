# Task Breakdown — Website Portofolio Fotografer

**Versi:** 2.0
**Tanggal:** 2026-09-28
**Acuan:** PRD, SRS, SDD, UI/UX v2.0

Estimasi kasar (S < 2 jam, M = 2–5 jam, L = 0,5–1 hari). Backend (Fase B) mayoritas PAKAI ULANG.

---

## Fase 0 — Setup Proyek v2
- [ ] T-01 Scaffold Next.js baru (`portofolio-v2`); cek `node_modules/next/dist/docs/` untuk breaking change (S)
- [ ] T-02 Install: `motion`, `@sentry/nextjs`; jalankan `npx autoskills` (13 skill best-practice) (S)
- [ ] T-03 Salin dari v1 TANPA perubahan: `lib/`, `app/api/`, `supabase/`, env var (S)
- [ ] T-04 Setup repo GitHub + Vercel project (preview branch `v2`) (S)
- [ ] T-05 Buat knowledge graph awal dengan Graphify (S)

## Fase B — Backend Pakai Ulang (verifikasi, bukan bangun)
- [ ] T-06 Verifikasi tabel `works` + RLS di Supabase (S)
- [ ] T-07 Verifikasi login Google `/masuk` + owner gate (S)
- [ ] T-08 Verifikasi upload Drive end-to-end dari HP (S)

## Fase 1 — Design System (UI UX Pro Max + Taste)
- [ ] T-09 Terapkan design token (warna, tipografi via `next/font`, radius 0–4px) di `globals.css` (S)
- [ ] T-10 Komponen dasar: Button, SectionHeading, Reveal, Float, Marquee, Badge (M)
- [ ] T-11 Navbar (hide-on-scroll-down) + Footer + ThemeProvider (S)

## Fase 2 — Halaman Publik
- [ ] T-12 Beranda: hero sinematik + pita kategori + karya pilihan + tentang singkat + kontak CTA (L)
- [ ] T-13 Galeri: grid editorial + filter + lightbox (M)
- [ ] T-14 Video: showreel (`is_featured`) + daftar video (M)
- [ ] T-15 Tentang + Kontak (baris bernomor) (S)
- [ ] T-16 Chatbox AI: UI baru + logika FAQ v1 (M)

## Fase 3 — Halaman Pemilik
- [ ] T-17 `/admin`: daftar karya + upload + urutan + showreel + hapus + kuota (selaraskan UI v2) (M)

## Fase 4 — Kualitas (Autoskills + Context7)
- [ ] T-18 Terapkan `react-best-practices`, `next-best-practices`, `typescript-advanced-types` (M)
- [ ] T-19 Terapkan `accessibility`: audit kontras, keyboard, ARIA, reduced-motion (M)
- [ ] T-20 Terapkan `seo`: metadata per halaman, OG, sitemap, robots, semantic HTML (S)
- [ ] T-21 Cek dokumentasi terbaru via Context7 untuk API yang dipakai (S)

## Fase 5 — Keamanan & Observabilitas (Cybersecurity + Sentry)
- [ ] T-22 Audit keamanan: owner gate, RLS, validasi file, rate-limit, header (M)
- [ ] T-23 Pasang Sentry + uji laporan error (S)
- [ ] T-24 Halaman error ramah (`error.tsx`, `not-found.tsx`) (S)

## Fase 6 — QA Anti-Slop + Go-live
- [ ] T-25 QA checklist UI/UX v2.0 §7 (eyebrow, CTA, layout, kontras, copy) (M)
- [ ] T-26 Lighthouse mobile ≥ 90 semua kategori; perbaiki yang kurang (M)
- [ ] T-27 Buat diagram arsitektur dengan Archify → `docs/architecture.html` (S)
- [ ] T-28 Perbarui knowledge graph (Graphify) (S)
- [ ] T-29 Review pemilik di HP via URL preview (S — pemilik)
- [ ] T-30 Merge `v2` → production; sambungkan domain `portofolio.muramsyah.biz.id` (S)

---

## Urutan Kerja Disarankan

**Fase 0 → B → 1 → 2 → 3 → 4 → 5 → 6**

## Kriteria Selesai (Definition of Done)

- Semua checklist Fase 6 centang.
- Lighthouse mobile ≥ 90 (Performance, Accessibility, Best Practices, SEO).
- Tidak ada error console pada alur utama.
- QA anti-slop (UI/UX §7) lolos.
- Build Vercel hijau; pemilik setuju via review HP.
