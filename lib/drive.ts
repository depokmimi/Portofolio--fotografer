// Helper Google Drive — HANYA dipakai di server.
// Token OAuth tidak pernah dikirim ke browser (PRD: keamanan file).

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const RESUMABLE_INIT_URL =
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
const DRIVE_API = "https://www.googleapis.com/drive/v3";

let cached: { token: string; expiresAt: number } | null = null;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`ENV ${name} belum diisi`);
  return v;
}

/** Cek tanpa melempar: true kalau 4 env Drive sudah terisi. */
export function isDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}

export function driveFolderId(): string {
  return env("GOOGLE_DRIVE_FOLDER_ID");
}

/** Access token dengan cache; refresh otomatis memakai refresh token. */
export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt - 60_000 > now) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("GOOGLE_CLIENT_ID"),
      client_secret: env("GOOGLE_CLIENT_SECRET"),
      refresh_token: env("GOOGLE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("Gagal me-refresh token Google Drive");
  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cached = { token: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return cached.token;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  parents?: string[];
}

/** Membuat sesi resumable upload; mengembalikan session URI sekali pakai. */
export async function createResumableSession(opts: {
  name: string;
  mimeType: string;
  size: number;
}): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(RESUMABLE_INIT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": opts.mimeType,
      "X-Upload-Content-Length": String(opts.size),
    },
    body: JSON.stringify({
      name: opts.name,
      parents: [driveFolderId()],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Drive menolak sesi upload (${res.status}) ${detail.slice(0, 120)}`
    );
  }
  const sessionUri = res.headers.get("location");
  if (!sessionUri) throw new Error("Drive tidak mengembalikan session URI");
  return sessionUri;
}

export type ChunkResult =
  | { complete: false; receivedEnd: number }
  | { complete: true; file: DriveFile };

/** Mengirim satu chunk ke sesi resumable. start inklusif, end eksklusif. */
export async function uploadChunk(
  sessionUri: string,
  chunk: ArrayBuffer,
  start: number,
  end: number,
  total: number
): Promise<ChunkResult> {
  const token = await getAccessToken();
  const res = await fetch(sessionUri, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Length": String(end - start),
      "Content-Range": `bytes ${start}-${end - 1}/${total}`,
    },
    body: chunk,
  });

  if (res.status === 308) {
    // Belum lengkap; baca posisi terakhir yang diterima Drive.
    const range = res.headers.get("range");
    const m = range?.match(/bytes=0-(\d+)/);
    return { complete: false, receivedEnd: m ? parseInt(m[1], 10) + 1 : start };
  }
  if (res.ok) {
    const file = (await res.json()) as DriveFile;
    return { complete: true, file };
  }
  const detail = await res.text().catch(() => "");
  throw new Error(
    `Drive menolak chunk (${res.status}) ${detail.slice(0, 120)}`
  );
}

/** Membatalkan sesi resumable (best-effort). */
export async function cancelResumableSession(
  sessionUri: string
): Promise<void> {
  try {
    const token = await getAccessToken();
    await fetch(sessionUri, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Diabaikan: sesi kedaluwarsa sendiri di sisi Google.
  }
}

export async function getDriveFile(fileId: string): Promise<DriveFile | null> {
  const token = await getAccessToken();
  const res = await fetch(
    `${DRIVE_API}/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,size,parents`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Drive files.get gagal (${res.status})`);
  return (await res.json()) as DriveFile;
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(
    `${DRIVE_API}/files/${encodeURIComponent(fileId)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok && res.status !== 404)
    throw new Error(`Drive files.delete gagal (${res.status})`);
}

export interface Quota {
  limit: number | null; // null = tidak ada info batas
  usage: number;
}

export async function getQuota(): Promise<Quota> {  const token = await getAccessToken();
  const res = await fetch(`${DRIVE_API}/about?fields=storageQuota`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Drive about gagal (${res.status})`);
  const data = (await res.json()) as {
    storageQuota?: { limit?: string; usage?: string };
  };
  const q = data.storageQuota ?? {};
  return {
    limit: q.limit ? parseInt(q.limit, 10) : null,
    usage: q.usage ? parseInt(q.usage, 10) : 0,
  };
}

/**
 * Mengambil thumbnail yang dibuat otomatis oleh Drive (foto & video).
 * Melempar error deskriptif kalau gagal (dicatat di route).
 */
export async function fetchThumbnail(fileId: string): Promise<Response> {
  const token = await getAccessToken();
  const meta = await fetch(
    `${DRIVE_API}/files/${encodeURIComponent(fileId)}?fields=thumbnailLink`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!meta.ok) throw new Error(`thumb-meta ${meta.status}`);
  const { thumbnailLink } = (await meta.json()) as { thumbnailLink?: string };
  if (!thumbnailLink) throw new Error("thumb-link-kosong");
  // Minta ukuran lebih besar untuk grid (default biasanya s220)
  const sized = thumbnailLink.replace(/=s\d+$/, "=s400");
  // thumbnailLink adalah URL kapabilitas berumur pendek: tanpa Authorization
  const res = await fetch(sized);
  if (!res.ok) throw new Error(`thumb-bytes ${res.status}`);
  return res;
}

/**
 * Mengambil byte file dari Drive untuk dialirkan ke pemilik via backend.
 * Mendukung header Range agar pratinjau video bisa seek.
 * Tidak menghasilkan URL publik apa pun (FR-07/FR-08).
 */
export async function fetchDriveMedia(
  fileId: string,
  range?: string | null
): Promise<Response> {
  const token = await getAccessToken();
  const res = await fetch(
    `${DRIVE_API}/files/${encodeURIComponent(fileId)}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(range ? { Range: range } : {}),
      },
    }
  );
  return res;
}
