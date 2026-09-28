# SDD — Website Portofolio Fotografer

**Versi:** 2.0
**Tanggal:** 2026-09-28
**Acuan:** PRD v2.0, SRS v2.0, SDD v1.0
**Diagram:** dibuat dengan skill Archify (lihat `docs/architecture.html`)

---

## 1. Arsitektur Sistem

```
                        ┌─────────────────────────────────┐
                        │  Pengunjung / Pemilik (HP)       │
                        └───────────────┬─────────────────┘
                                        │ HTTPS
                        ┌───────────────▼─────────────────┐
                        │  Vercel — Next.js App Router    │
                        │  ┌──────────┐  ┌──────────────┐ │
                        │  │  Pages   │  │ API Routes   │ │
                        │  │ (RSC +   │  │ (owner gate  │ │
                        │  │  Client) │  │  di server)  │ │
                        │  └────┬─────┘  └──────┬───────┘ │
                        └───────┼───────────────┼─────────┘
                 ┌──────────────┼───────────────┼──────────────┐
                 │              │               │              │
        ┌────────▼──────┐ ┌────▼────────┐ ┌────▼─────────┐ ┌──▼──────────┐
        │ Supabase Auth │ │ Supabase PG │ │ Google Drive │ │   Sentry    │
        │ (Google OAuth │ │ tabel       │ │ API v3       │ │ (error      │
        │  pemilik)     │ │ `works`     │ │ folder       │ │  tracking)  │
        │               │ │             │ │ "Portofolio" │ │             │
        └───────────────┘ └─────────────┘ └──────────────┘ └─────────────┘
              ▲ DIPAKAI ULANG v1 (tanpa perubahan) ▲
```

- **Hosting:** Vercel (Hobby). File karya TIDAK disimpan di Vercel.
- **Auth & DB:** Supabase — Auth hanya pemilik; tidak ada sign-up publik.
- **Storage:** Google Drive pribadi via OAuth2 refresh token (pola Galeri Pribadi).
- **Monitoring:** Sentry (paket gratis) untuk error production.
- Pola upload tetap: **chunked/resumable** — `POST /api/upload/init` → `POST /api/upload/chunk` → `POST /api/upload/selesai`.

### 1.1 Arsitektur Frontend (baru v2)

- **Rendering:** Server Components untuk layout statis; `"use client"` hanya di daun interaktif (aturan Taste Skill §3.A).
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`), design token via `@theme inline`.
- **Animasi:** paket `motion` (`import { motion } from "motion/react"`); hanya `transform`/`opacity`; `useReducedMotion()` di semua animasi non-esensial.
- **Font:** `next/font` (self-host, `display: swap`); tidak ada `<link>` Google Fonts di production.
- **Ikon:** satu keluarga ikon per proyek.
- **State:** `useState` lokal untuk UI; tidak ada state global (tidak perlu).

## 2. Model Data — PAKAI ULANG v1 (Supabase Postgres)

```sql
-- v1: tabel `works` — TIDAK DIUBAH
works (
  id            uuid PK DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  category      text,                  -- Wedding, Prewedding, Wisuda, ...
  type          text NOT NULL,         -- 'photo' | 'video'
  drive_file_id text NOT NULL,         -- id file di Google Drive
  duration      text,                  -- durasi video (opsional)
  position      int DEFAULT 0,         -- urutan tampil (FR-09)
  is_featured   boolean DEFAULT false, -- showreel utama (FR-10)
  created_at    timestamptz DEFAULT now()
);
```

RLS: publik boleh **read**; **write** hanya untuk user terautentikasi (ditambah owner gate di API).
Kontrak ini dibekukan untuk v2 — frontend baru wajib kompatibel penuh.

## 3. Desain API — PAKAI ULANG v1 (Next.js Route Handlers)

| Method & Path | Akses | Fungsi |
|---|---|---|
| `GET /api/works` | publik | List karya (filter `?category=`, urut `position`) |
| `GET /api/works/[id]/thumbnail` | publik | Thumbnail via Drive + fallback berlapis |
| `GET /api/works/[id]/file` | publik | Stream file asli (foto penuh / video) |
| `POST /api/upload/init` | pemilik | Mulai sesi upload resumable ke Drive |
| `POST /api/upload/chunk` | pemilik | Kirim potongan file |
| `POST /api/upload/selesai` | pemilik | Verifikasi ke Drive → simpan baris `works` |
| `PATCH /api/works/[id]` | pemilik | Ubah title/category/position/is_featured |
| `DELETE /api/works/[id]` | pemilik | Hapus file Drive + baris `works` |
| `GET /api/drive/auth` | pemilik | Mulai OAuth Google Drive |
| `GET /api/drive/callback` | pemilik | Terima code → refresh token (disimpan manual ke env) |
| `GET /api/storage` | pemilik | Sisa kuota Google Drive |

Semua route pemilik: `supabase.auth.getUser()` di server, cocokkan email dengan `OWNER_EMAIL`.

## 4. Halaman & Rute (v2)

| Rute | Akses | Isi |
|---|---|---|
| `/` | publik | Hero sinematik, cuplikan karya, tentang singkat, CTA kontak |
| `/galeri` | publik | Grid editorial + filter kategori + lightbox |
| `/video` | publik | Showreel (`is_featured`) + daftar video |
| `/tentang` | publik | Profil, gaya, layanan |
| `/kontak` | publik | Baris kontak bernomor (WA/IG/Email) |
| `/masuk` | publik | Login Google pemilik (pakai ulang) |
| `/admin` | pemilik | Kelola karya: upload, urutan, showreel, hapus, kuota |
| `/auth/callback` | sistem | Callback OAuth Supabase (pakai ulang) |
| `/api/drive/*` | pemilik | OAuth Drive (pakai ulang) |

## 5. Desain Chatbox AI — PAKAI ULANG logika v1, UI baru

Pencocokan FAQ kata kunci di server; UI ditulis ulang mengikuti design system v2 (lihat UI/UX v2.0 §5). Topik wajib FAQ awal: layanan, harga, booking, lokasi, durasi & hasil, kontak.

## 6. Keamanan (audit: Cybersecurity Skills)

- Owner gate di setiap route tulis (jangan hanya andalkan RLS).
- Validasi MIME + ukuran di server sebelum teruskan ke Drive.
- Rate-limit: upload 10/menit/IP, chatbox 30/menit/IP (in-memory).
- Header: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP dasar (izinkan `*.googleusercontent.com`, `*.supabase.co`).
- Tidak ada secret di client; error production tanpa stack trace.

## 7. Strategi Performa (Autoskills + Context7)

- `next/image` untuk semua foto (`sizes` tepat, `priority` hanya hero); `loading="lazy"` di bawah fold.
- Video: `preload="none"` di grid; `<video controls playsInline>` di showreel/lightbox.
- Halaman publik: ISR (`revalidate`) + revalidasi on-demand saat admin mengubah karya.
- Font: `next/font` subset latin; `display: swap`.
- Bundle: `motion` diimpor per-komponen; tidak ada Three.js (tidak dibutuhkan).
- Target: Lighthouse mobile ≥ 90 semua kategori.

## 8. Observabilitas

- **Sentry** (v2 baru): `@sentry/nextjs`, DSN via env server; source-map diupload saat build; sample rate 10% di production.
- **Datadog:** belum diimplementasikan (butuh akun); dokumen ini mencatat titik integrasi masa depan: log API upload, metrik galeri.
- **Graphify:** knowledge graph codebase dibuat tiap rilis besar untuk onboarding & perawatan.

## 9. Keputusan & Catatan

- Backend v1 dipakai ulang 100% — keputusan pemilik 2026-09-28 ("Tetep pake aja").
- Tetap di Vercel; Cloudflare Workers dicatat sebagai opsi NANTI (skill Cloudflare tersedia).
- Composio (1000+ integrasi SaaS) dicatat sebagai opsi NANTI bila butuh otomasi (mis. notifikasi WA otomatis).
- Domain: `portofolio.muramsyah.biz.id` (diputuskan sebelum go-live v2).
- Versi Next.js v2 bisa punya breaking change vs v1 — baca `node_modules/next/dist/docs/` sebelum coding (aturan `AGENTS.md`).
