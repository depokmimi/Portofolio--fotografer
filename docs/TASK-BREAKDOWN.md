# Task Breakdown — Website Portofolio Fotografer

**Versi:** 2.0
**Tanggal:** 2026-09-28
**Acuan:** PRD, SRS, SDD, UI/UX v2.0

Estimasi kasar (S < 2 jam, M = 2–5 jam, L = 0,5–1 hari). Backend (Fase B) mayoritas PAKAI ULANG.

---

## Fase 0 — Setup Proyek v2
- [x] T-01 Scaffold Next.js baru (`portofolio-v2`); cek `node_modules/next/dist/docs/` untuk breaking change (S) — SELESAI: Scaffold + repo lokal + push branch v2 selesai
- [x] T-02 Install: `motion`, `@sentry/nextjs`; jalankan `npx autoskills` (13 skill best-practice) (S) — SELESAI: motion terpasang; autoskills dijalankan (12 skill project-specific)
- [x] T-03 Salin dari v1 TANPA perubahan: `lib/`, `app/api/`, `supabase/`, env var (S) — SELESAI: lib/supabase*, lib/works, lib/drive (port dari galeri), API drive auth/callback disalin & diadaptasi
- [x] T-04 Setup repo GitHub + Vercel project (preview branch `v2`) (S) — SELESAI: Repo GitHub + Vercel project ada; preview branch v2 aktif (dep protection ON)
- [ ] T-05 Buat knowledge graph awal dengan Graphify (S)

## Fase B — Backend Pakai Ulang (verifikasi, bukan bangun)
- [x] T-06 Verifikasi tabel `works` + RLS di Supabase (S) — SELESAI: Tabel works + RLS terverifikasi via SQL Editor (2026-09-28)
- [ ] T-07 Verifikasi login Google `/masuk` + owner gate (S)
- [ ] T-08 Verifikasi upload Drive end-to-end dari HP (S)

## Fase 1 — Design System (UI UX Pro Max + Taste)
- [x] T-09 Terapkan design token (warna, tipografi via `next/font`, radius 0–4px) di `globals.css` (S) — SELESAI: Token dark-monokrom di globals.css; font Anton/Bodoni/Manrope/Pinyon
- [x] T-10 Komponen dasar: Button, SectionHeading, Reveal, Float, Marquee, Badge (M) — SELESAI: Reveal, PageHeader, Lightbox, Marquee dkk di app/components
- [x] T-11 Navbar (hide-on-scroll-down) + Footer + ThemeProvider (S) — SELESAI: Navbar + Footer dark monokrom selesai

## Fase 2 — Halaman Publik
- [x] T-12 Beranda: hero sinematik + pita kategori + karya pilihan + tentang singkat + kontak CTA (L) — SELESAI: Beranda dark monokrom luxury selesai & terverifikasi desktop
- [x] T-13 Galeri: grid editorial + filter + lightbox (M) — SELESAI: Galeri + filter + lightbox selesai & terverifikasi
- [x] T-14 Video: showreel (`is_featured`) + daftar video (M) — SELESAI: Video: showreel + 5 video + modal selesai & terverifikasi
- [x] T-15 Tentang + Kontak (baris bernomor) (S) — SELESAI: Tentang + Kontak selesai (bug delay animasi diperbaiki, menunggu verifikasi ulang)
- [x] T-16 Chatbox AI: UI baru + logika FAQ v1 (M) — SELESAI: Chatbox FAQ selesai (app/components/Chatbox.tsx), tampil di semua halaman publik

## Fase 3 — Halaman Pemilik
- [x] T-17 `/admin`: daftar karya + upload + urutan + showreel + hapus + kuota (selaraskan UI v2) (M) — SELESAI: /admin selesai: status Drive+kuota, upload resumable, daftar/hapus/urut/featured

## Fase 4 — Kualitas (Autoskills + Context7)
- [ ] T-18 Terapkan `react-best-practices`, `next-best-practices`, `typescript-advanced-types` (M)
- [ ] T-19 Terapkan `accessibility`: audit kontras, keyboard, ARIA, reduced-motion (M)
- [x] T-20 Terapkan `seo`: metadata per halaman, OG, sitemap, robots, semantic HTML (S) — SELESAI: Metadata + OG + sitemap.xml + robots.txt selesai
- [ ] T-21 Cek dokumentasi terbaru via Context7 untuk API yang dipakai (S)

## Fase 5 — Keamanan & Observabilitas (Cybersecurity + Sentry)
- [ ] T-22 Audit keamanan: owner gate, RLS, validasi file, rate-limit, header (M)
- [ ] T-23 Pasang Sentry + uji laporan error (S)
- [x] T-24 Halaman error ramah (`error.tsx`, `not-found.tsx`) (S) — SELESAI: error.tsx + not-found.tsx selesai

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
