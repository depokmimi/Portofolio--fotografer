"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import { getSupabase, isOwnerEmail } from "@/lib/supabase";

const CATEGORIES = ["Wedding", "Prewedding", "Portrait", "Wisuda", "Keluarga", "Event"];

interface Work {
  id: string;
  title: string;
  category: string;
  type: string;
  drive_file_id: string | null;
  duration: string | null;
  position: number;
  is_featured: boolean;
}

interface DriveStatus {
  configured: boolean;
  quota?: { limit: number | null; usage: number } | null;
  warning?: string;
}

const CHUNK = 1 * 1024 * 1024; // 1MB: tiap percobaan cepat selesai, kecil risiko timeout
// Batas satu percobaan chunk; kalau macet, batalkan dan retry (sesi resumable aman diulang)
const ATTEMPT_TIMEOUT_MS = 50_000;

function fmtBytes(n: number): string {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / 1024 ** i).toFixed(1)} ${u[i]}`;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  type: string;
}

export default function AdminClient() {
  const router = useRouter();
  const [gate, setGate] = useState<"loading" | "ok" | "denied">("loading");
  const [works, setWorks] = useState<Work[]>([]);
  const [drive, setDrive] = useState<DriveStatus | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [importing, setImporting] = useState<string | null>(null);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadWorks = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("works")
      .select("id,title,category,type,drive_file_id,duration,position,is_featured")
      .order("position", { ascending: true });
    if (data) setWorks(data as Work[]);
  }, []);

  const loadDrive = useCallback(async () => {
    try {
      const r = await fetch("/api/drive/status");
      if (r.ok) setDrive((await r.json()) as DriveStatus);
    } catch {
      /* abaikan */
    }
  }, []);

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      if (!sb) {
        setGate("denied");
        return;
      }
      const { data } = await sb.auth.getSession();
      if (!data.session || !isOwnerEmail(data.session.user.email)) {
        router.replace("/masuk");
        return;
      }
      setGate("ok");
      loadWorks();
      loadDrive();
    })();
  }, [router, loadWorks, loadDrive]);

  async function logout() {
    await getSupabase()?.auth.signOut();
    router.replace("/");
  }

  async function toggleFeatured(w: Work) {
    const r = await fetch("/api/works", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: w.id, patch: { is_featured: !w.is_featured } }),
    });
    if (r.ok) loadWorks();
    else setMsg("Gagal mengubah featured.");
  }

  async function removeWork(w: Work) {
    if (!confirm(`Hapus "${w.title}"? File di Drive ikut terhapus.`)) return;
    const r = await fetch(`/api/drive/files?id=${encodeURIComponent(w.id)}`, {
      method: "DELETE",
    });
    if (r.ok) {
      setMsg(`"${w.title}" dihapus.`);
      loadWorks();
    } else setMsg("Gagal menghapus.");
  }

  async function moveWork(w: Work, dir: -1 | 1) {
    const idx = works.findIndex((x) => x.id === w.id);
    const other = works[idx + dir];
    if (!other) return;
    // tukar position
    await fetch("/api/works", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: w.id, patch: { position: other.position } }),
    });
    await fetch("/api/works", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: other.id, patch: { position: w.position } }),
    });
    loadWorks();
  }

  const loadDriveFiles = useCallback(async () => {
    try {
      const r = await fetch("/api/drive/list");
      if (!r.ok) return;
      const data = await r.json();
      const registered = new Set(works.map((w) => w.drive_file_id));
      setDriveFiles((data.files || []).filter((f: DriveFile) => !registered.has(f.id)));
    } catch {
      /* abaikan */
    }
  }, [works]);

  async function importFromDrive(f: DriveFile) {
    const title = prompt(`Judul untuk "${f.name}":`, f.name.replace(/\.[^.]+$/, ""));
    if (!title || !title.trim()) return;
    setImporting(f.id);
    setMsg(null);
    try {
      const r = await fetch("/api/drive/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driveFileId: f.id,
          name: f.name,
          mimeType: f.mimeType,
          title: title.trim(),
          category,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Gagal import.");
      setMsg(`"${title.trim()}" berhasil ditambahkan.`);
      loadWorks();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Gagal import.");
    } finally {
      setImporting(null);
    }
  }

  async function testUploadConnection() {
    setMsg("Mengetes koneksi upload…");
    try {
      // Kirim 256KB data dummy ke endpoint test
      const dummy = new Uint8Array(256 * 1024);
      const r = await fetch("/api/drive/upload/test-chunk", {
        method: "POST",
        body: dummy,
      });
      const data = await r.json();
      if (r.ok && data.ok) {
        setMsg(`Tes berhasil! Server menerima ${data.receivedBytes} bytes. Koneksi browser→server OK.`);
      } else {
        setMsg(`Tes gagal: ${data.error || r.status}`);
      }
    } catch (e) {
      setMsg(`Tes gagal: ${e instanceof Error ? e.message : "unknown"}. Browser tidak bisa kirim data ke server.`);
    }
  }

  async function startUpload() {
    if (!file || !title.trim() || busy) return;
    setBusy(true);
    setProgress(0);
    setMsg(null);
    try {
      setMsg("Menyiapkan unggahan…");
      const initR = await fetch("/api/drive/upload/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, mimeType: file.type, size: file.size }),
      }).catch(() => {
        throw new Error("Gagal menghubungi server (init). Periksa koneksi internet.");
      });
      const init = await initR.json();
      if (!initR.ok) throw new Error(init.message || init.error || "Gagal memulai unggahan.");

      const sessionUri: string = init.sessionUri;
      let offset = 0;
      let driveFileId = "";
      const totalChunks = Math.ceil(file.size / CHUNK);
      let chunkIdx = 0;
      while (offset < file.size) {
        chunkIdx++;
        setMsg(`Mengunggah… ${chunkIdx}/${totalChunks} (${Math.round((offset / file.size) * 100)}%)`);
        const end = Math.min(offset + CHUNK, file.size);
        let res: Response | null = null;
        let lastErr = "";
        // Retry 5x per chunk dengan jeda exponential; tiap percobaan dibatasi
        // timeout agar percobaan yang macet cepat gagal dan dicoba ulang.
        for (let attempt = 1; attempt <= 5; attempt++) {
          const ac = new AbortController();
          const timer = setTimeout(() => ac.abort(), ATTEMPT_TIMEOUT_MS);
          try {
            const proxyUrl = `/api/drive/upload/chunk?start=${offset}&end=${end}&total=${file.size}`;
            res = await fetch(proxyUrl, {
              method: "POST",
              headers: { "X-Session-Uri": sessionUri },
              body: file.slice(offset, end),
              signal: ac.signal,
            });
            const data = await res.json();
            if (!res.ok) {
              const t = data.timing ? ` [auth:${data.timing.authMs}ms recv:${data.timing.recvMs}ms google:${data.timing.googleMs}ms]` : "";
              throw new Error((data.error || `Server menolak chunk (${res.status})`) + t);
            }
            // Normalisasi ke bentuk seperti respons Google
            if (data.status === 308) {
              res = new Response(null, {
                status: 308,
                headers: data.range ? { range: data.range } : {},
              });
            } else {
              res = new Response(JSON.stringify({ id: data.id }), { status: 200 });
            }
            break; // sukses, keluar dari loop retry
          } catch (e) {
            lastErr =
              e instanceof Error
                ? e.name === "AbortError"
                  ? "timeout 50 dtk (koneksi macet)"
                  : e.message
                : "network error";
            if (attempt < 5) {
              setMsg(`Mengunggah… ${chunkIdx}/${totalChunks} (percobaan ${attempt + 1}/5)`);
              await new Promise((r) => setTimeout(r, 3000 * attempt));
            }
          } finally {
            clearTimeout(timer);
          }
        }
        if (!res) {
          throw new Error(`Gagal mengunggah bagian ${chunkIdx}/${totalChunks} setelah 5x coba (${lastErr}). Periksa koneksi lalu coba lagi.`);
        }
        if (res.status === 308) {
          const m = res.headers.get("range")?.match(/bytes=0-(\d+)/);
          offset = m ? parseInt(m[1], 10) + 1 : end;
        } else if (res.ok) {
          driveFileId = ((await res.json()) as { id: string }).id;
          offset = end;
        } else {
          throw new Error(`Unggah ke Drive gagal (${res.status}) pada bagian ${chunkIdx}/${totalChunks}.`);
        }
        setProgress(Math.round((offset / file.size) * 100));
      }

      setMsg("Menyimpan data karya…");
      const finR = await fetch("/api/drive/upload/selesai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driveFileId,
          title: title.trim(),
          category,
          type: file.type.startsWith("video") ? "video" : "photo",
        }),
      }).catch(() => {
        throw new Error("Gagal menghubungi server (selesai). File mungkin sudah terunggah ke Drive.");
      });
      const fin = await finR.json();
      if (!finR.ok) throw new Error(fin.error || "Gagal menyimpan karya.");

      setMsg(`"${title.trim()}" berhasil diunggah.`);
      setFile(null);
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      loadWorks();
      loadDrive();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Unggahan gagal.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  if (gate === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white/60">
        <p className="text-xs tracking-[0.3em] uppercase">Memeriksa akses…</p>
      </div>
    );
  }
  if (gate === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-center">
        <div>
          <p className="font-display text-4xl text-white uppercase">Akses ditolak</p>
          <button
            onClick={() => router.replace("/masuk")}
            className="mt-6 border border-white/30 px-6 py-3 text-xs tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black"
          >
            Ke halaman masuk
          </button>
        </div>
      </div>
    );
  }

  const quotaPct =
    drive?.quota && drive.quota.limit
      ? Math.min(100, Math.round((drive.quota.usage / drive.quota.limit) * 100))
      : null;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-5 pt-24 pb-20 md:px-10 md:pt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">Area Pemilik</p>
            <h1 className="font-display mt-2 text-4xl text-white uppercase md:text-5xl">
              Kelola Karya
            </h1>
          </div>
          <button
            onClick={logout}
            className="shrink-0 border border-white/30 px-5 py-2.5 text-[11px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-white hover:text-black"
          >
            Keluar
          </button>
        </div>

        {msg && (
          <p className="mt-6 border border-white/20 bg-white/5 px-4 py-3 text-sm text-white">
            {msg}
          </p>
        )}

        {/* STATUS */}
        <section className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2">
          <div className="bg-black p-6">
            <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">01 — Database</p>
            <p className="mt-3 text-lg font-semibold text-white">Supabase terhubung</p>
            <p className="mt-1 text-sm text-white/50">{works.length} karya tercatat.</p>
          </div>
          <div className="bg-black p-6">
            <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">02 — Google Drive</p>
            {drive === null ? (
              <p className="mt-3 text-sm text-white/50">Memeriksa…</p>
            ) : drive.configured ? (
              <>
                <p className="mt-3 text-lg font-semibold text-white">Tersambung ✓</p>
                {quotaPct !== null && drive.quota ? (
                  <div className="mt-3">
                    <div className="h-1.5 bg-white/10">
                      <div className="h-full bg-white" style={{ width: `${quotaPct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      {fmtBytes(drive.quota.usage)} / {drive.quota.limit ? fmtBytes(drive.quota.limit) : "?"} ({quotaPct}%)
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-white/50">Info kuota tidak tersedia.</p>
                )}
                {drive.warning && <p className="mt-2 text-xs text-yellow-300">{drive.warning}</p>}
              </>
            ) : (
              <>
                <p className="mt-3 text-lg font-semibold text-white">Belum tersambung</p>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-white/60">
                  <li>Tambah GOOGLE_CLIENT_SECRET di Vercel → Redeploy.</li>
                  <li>Daftarkan redirect URI <code className="text-white/80">/api/drive/callback</code> di Google Cloud.</li>
                  <li>Klik tombol di bawah sambil login sebagai pemilik.</li>
                </ol>
                <a
                  href="/api/drive/auth"
                  className="mt-4 inline-block bg-[#F5D90A] px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-black uppercase"
                >
                  Sambungkan Drive →
                </a>
              </>
            )}
          </div>
        </section>

        {/* UPLOAD */}
        <section className="mt-px border border-white/10 bg-black p-6">
          <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">03 — Unggah karya baru</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
            <label className="block">
              <span className="text-xs text-white/60">File foto / video</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full cursor-pointer border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white file:mr-3 file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-black"
              />
            </label>
            <label className="block">
              <span className="text-xs text-white/60">Judul karya</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="cth. Janji Suci di Uluwatu"
                className="mt-1 block w-full border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30"
              />
            </label>
            <label className="block">
              <span className="text-xs text-white/60">Kategori</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border border-white/20 bg-black px-3 py-2.5 text-sm text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <button
                onClick={startUpload}
                disabled={!file || !title.trim() || busy}
                className="flex-1 bg-white px-5 py-3 text-[11px] font-bold tracking-[0.2em] text-black uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
              >
                {busy ? "Mengunggah…" : "Unggah ke Drive"}
              </button>
              <button
                onClick={testUploadConnection}
                disabled={busy}
                className="border border-white/20 px-3 py-3 text-[11px] text-white/60 uppercase disabled:opacity-30"
                title="Tes koneksi upload"
              >
                Tes
              </button>
            </div>
          </div>
          {progress !== null && (
            <div className="mt-4">
              <div className="h-1.5 bg-white/10">
                <div className="h-full bg-[#F5D90A] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/50">{progress}%</p>
            </div>
          )}
        </section>

        {/* IMPORT DARI DRIVE */}
        <section className="mt-px border border-white/10 bg-black p-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">
              04 — Import dari Drive
            </p>
            <button
              onClick={loadDriveFiles}
              className="border border-white/20 px-3 py-2 text-[11px] text-white/60 uppercase"
            >
              Cek Drive
            </button>
          </div>
          <p className="mt-3 text-xs text-white/50">
            Upload video besar lewat aplikasi Google Drive ke folder <span className="font-semibold text-white">"Portofolio"</span>, lalu klik "Cek Drive" dan import di sini.
          </p>
          <p className="mt-2 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
            📁 Pastikan upload ke folder <span className="font-bold">"Portofolio"</span> di Google Drive (bukan folder lain). File di folder lain tidak akan muncul di sini.
          </p>
          {driveFiles.length > 0 && (
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {driveFiles.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{f.name}</p>
                    <p className="text-xs text-white/40">
                      {f.type === "video" ? "Video" : f.type === "photo" ? "Foto" : f.mimeType} · {fmtBytes(f.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => importFromDrive(f)}
                    disabled={importing === f.id}
                    className="shrink-0 bg-white px-4 py-2 text-[11px] font-bold text-black uppercase disabled:opacity-30"
                  >
                    {importing === f.id ? "…" : "Import"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* DAFTAR KARYA */}
        <section className="mt-10">
          <p className="text-[11px] tracking-[0.3em] text-white/50 uppercase">
            05 — Daftar karya ({works.length})
          </p>
          {works.length === 0 ? (
            <p className="mt-4 border border-dashed border-white/20 p-8 text-center text-sm text-white/40">
              Belum ada karya. Unggah karya pertama di atas.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {works.map((w, i) => (
                <li key={w.id} className="flex items-center gap-3 py-4 md:gap-5">
                  <span className="w-8 shrink-0 font-mono text-xs text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{w.title}</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {w.category} · {w.type === "video" ? "Video" : "Foto"}
                      {w.duration ? ` · ${w.duration}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 md:gap-2">
                    <button
                      onClick={() => moveWork(w, -1)}
                      disabled={i === 0}
                      aria-label="Naik"
                      className="px-2 py-1 text-white/60 hover:text-white disabled:opacity-20"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveWork(w, 1)}
                      disabled={i === works.length - 1}
                      aria-label="Turun"
                      className="px-2 py-1 text-white/60 hover:text-white disabled:opacity-20"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => toggleFeatured(w)}
                      aria-label="Toggle featured"
                      title="Tandai sebagai featured"
                      className={`px-2 py-1 text-lg ${w.is_featured ? "text-[#F5D90A]" : "text-white/25 hover:text-white/60"}`}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => removeWork(w)}
                      className="border border-red-500/40 px-3 py-1.5 text-[11px] tracking-widest text-red-400 uppercase hover:bg-red-500 hover:text-white"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-white/35">
            ★ = tampil di “Karya Pilihan” beranda. ↑↓ mengatur urutan tampil.
          </p>
        </section>
      </main>
    </>
  );
}
