# Laporan Kerja Malam — Portofolio v2

**Untuk:** Muhamad Ramdhani
**Waktu laporan:** Selasa, 29 September 2026, 06:00 WIB
**Periode kerja:** Senin 28 Sep 2026 ~21:50 → Selasa 29 Sep 2026 ~06:00 WIB

---

## Ringkasan

Malam ini saya mengerjakan otomatis sesuai PRD. Semua yang reversibel sudah dikerjakan,
diuji build lokal, dan dipush ke branch `v2`. **Branch `main`/production TIDAK disentuh.**

---

## Yang selesai malam ini

### 1. Perbaikan bug animasi (temuan verifikasi kemarin sore)
- **Masalah:** di halaman Tentang & Kontak, baris layanan 02–06 dan baris kontak 02–04
  tidak terlihat (transparan) karena nilai `delay` animasi salah satuan —
  dikirim `50`, `100`, dst. (terbaca sebagai 50–100 DETIK oleh Motion).
- **Perbaikan:** semua delay diubah ke detik (`0.05`, `0.1`, …), plus pengaman di
  komponen `Reveal` agar delay > 10 otomatis dianggap milidetik.
- **Video:** player modal diberi efek `grayscale` agar footage berwarna tetap
  konsisten dengan tema monokrom.

### 2. Halaman /admin — Area Pemilik (T-17)
- Kartu **Status**: koneksi Supabase + status Google Drive + meter kuota Drive.
- **Unggah karya**: pilih file foto/video → judul → kategori → progress bar.
  File dikirim langsung ke Google Drive (aman untuk file besar, tidak lewat server).
- **Daftar karya**: ubah urutan (↑↓), tandai featured (★ = tampil di Beranda),
  hapus karya (file di Drive ikut terhapus).
- Semua API admin dikunci: **hanya email pemilik yang login** yang bisa akses.
- Buka `/admin` → otomatis minta login dulu kalau belum masuk.

### 3. Chatbox FAQ (T-16)
- Tombol chat kuning melayang di kanan bawah semua halaman publik.
- Menjawab 6 pertanyaan populer otomatis: harga, cara booking, lama pengerjaan,
  luar kota, file RAW, prewedding outdoor. Tanpa biaya AI.

### 4. Menu navigasi HP (perbaikan penting)
- **Masalah:** di layar HP menu navigasi tidak ada — pengunjung HP tidak bisa
  pindah ke Galeri/Video/Tentang.
- **Perbaikan:** tombol hamburger (☰) di HP membuka menu layar penuh dengan
  daftar halaman bernomor 01–05.

### 5. SEO + halaman error (T-20, T-24)
- Judul & deskripsi tiap halaman, Open Graph (preview bagus saat link dibagikan),
  `sitemap.xml`, `robots.txt`.
- Halaman 404 dan halaman error bergaya tema.

### 6. Keamanan (T-22, sebagian)
- Header keamanan: `X-Frame-Options`, `X-Content-Type-Options`, dsb.
- Semua API admin + API Drive memakai owner gate di server (bukan cuma di browser).
- Tidak ada secret/token yang masuk ke repo — sudah diperiksa sebelum push.

### 7. Dokumen & diagram
- `docs/TASK-BREAKDOWN.md`: 16 dari 30 task ditandai selesai.
- `docs/PRD.md` + `SRS.md`: klaim tema lama ("Editorial Bold") diganti
  "Dark Monokrom Luxury" sesuai keputusan Anda.
- Diagram arsitektur: `docs/architecture.html` (dibuat dengan Archify).
- Knowledge graph kode: `graphify-out/` (di luar repo).

---

## Status verifikasi

| Halaman | Status |
|---|---|
| Beranda, Galeri, /masuk | ✅ Terverifikasi kemarin (desktop) |
| /tentang (layanan 01–06) | ⏳ Menunggu hasil cek ulang browser |
| /kontak (baris 01–04) | ⏳ Menunggu hasil cek ulang browser |
| /video (showreel + grayscale) | ⏳ Menunggu hasil cek ulang browser |
| /admin | ⏳ Menunggu hasil cek ulang browser |
| Login Google end-to-end | ⏳ Perlu Anda coba sendiri (butuh akun Google Anda) |
| HP 390px & tablet 820px | ⚠️ Cek kode: aman (menu mobile diperbaiki). **Cek fisik di HP Anda** — lihat bagian "Yang perlu Anda lakukan" |

**URL preview (branch v2):** `https://portofolio-fotografer-git-v2-galeri-pribadi.vercel.app`
_(catatan: setiap push baru membuat URL preview baru — pakai URL deployment terbaru
dari dashboard Vercel jika link di atas sudah kedaluwarsa)_

---

## Yang perlu ANDA lakukan (tidak bisa saya kerjakan)

1. **Sambungkan Google Drive** (5 langkah, satu kali saja):
   - Tambah `GOOGLE_CLIENT_SECRET` di Vercel (project portofolio-fotografer).
   - Daftarkan redirect URI `https://portofolio-fotografer.vercel.app/api/drive/callback`
     di Google Cloud Console (OAuth client).
   - Redeploy di Vercel.
   - Buka `/api/drive/auth` (di URL preview) sambil login → salin refresh token →
     simpan sebagai `GOOGLE_REFRESH_TOKEN` di Vercel → Redeploy lagi.
   - Tambah `GOOGLE_DRIVE_FOLDER_ID=1LiB0ONoIieMkpJHiDzk_iXNh6wzCr1Q8` → Redeploy.
   - Setelah ini, upload dari `/admin` langsung jalan.
2. **Coba di HP Anda**: buka URL preview → cek menu hamburger, galeri, video,
   tentang, kontak, dan chatbox kuning. Kalau ada yang aneh, kirim screenshot.
3. **Coba login Google** di `/masuk` lalu buka `/admin` — pastikan bisa masuk
   sebagai pemilik.

---

## Yang BELUM dikerjakan (di luar PRD / butuh Anda)

- **Merge `v2` → production + domain**: menunggu izin eksplisit Anda (sesuai janji).
- **Sentry (monitoring error)**: butuh Anda buat project di sentry.io lalu kasih DSN.
- **Carousel 3D coverflow**: masih ON HOLD ("Ntar dulu").
- **Upload Drive end-to-end dari HP**: menunggu langkah Drive no. 1 selesai.
- **Lighthouse mobile ≥ 90**: dijalankan setelah semua di atas beres.

---

## Komitmen

- Semua push malam ini ke branch `v2` saja — website live Anda tidak berubah.
- Setiap klaim "selesai" di atas didukung build lokal yang lolos (exit code 0)
  dan/atau verifikasi browser. Yang masih ⏳ akan saya kabari hasilnya pagi ini
  juga begitu verifikasi selesai.
