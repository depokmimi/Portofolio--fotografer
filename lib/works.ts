import { getSupabase, isSupabaseConfigured } from "./supabase";

/** Satu karya foto. */
export interface WorkPhoto {
  id: string;
  title: string;
  category: string;
  /** Path gambar lokal (fallback). */
  src: string;
  /** Kalau ada, gambar diambil dari Drive via API. */
  driveFileId?: string;
}

interface WorkRow {
  id: string;
  title: string;
  category: string;
  type: string;
  drive_file_id: string;
  duration: string | null;
  position: number;
  is_featured: boolean;
}

/** Karya bawaan (gambar lokal hitam-putih) — dipakai kalau DB kosong. */
export const LOCAL_PHOTOS: WorkPhoto[] = [
  { id: "local-1", title: "Janji Suci", category: "Wedding", src: "/images/wedding.jpg" },
  { id: "local-2", title: "Cerita Kita Berdua", category: "Prewedding", src: "/images/prewed.jpg" },
  { id: "local-3", title: "Tatapan", category: "Portrait", src: "/images/portrait.jpg" },
  { id: "local-4", title: "Hari Kelulusan", category: "Wisuda", src: "/images/wisuda.jpg" },
  { id: "local-5", title: "Senja Pengantin", category: "Wedding", src: "/images/hero.jpg" },
];

/** URL gambar karya: Drive (kalau sudah wiring) atau gambar lokal. */
export function workPhotoUrl(p: WorkPhoto): string {
  if (p.driveFileId) return `/api/drive/thumb/${p.driveFileId}`;
  return p.src;
}

/**
 * Ambil foto karya dari Supabase (diurutkan berdasarkan position).
 * Fallback ke gambar lokal kalau Supabase belum dikonfigurasi,
 * tabel masih kosong, atau query gagal — web tidak pernah blank.
 */
export async function getPhotos(): Promise<WorkPhoto[]> {
  if (!isSupabaseConfigured()) return LOCAL_PHOTOS;
  try {
    const supabase = getSupabase()!;
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .eq("type", "photo")
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return LOCAL_PHOTOS;
    return (data as WorkRow[]).map((w) => ({
      id: w.id,
      title: w.title,
      category: w.category,
      src: "/images/hero.jpg",
      driveFileId: w.drive_file_id,
    }));
  } catch {
    return LOCAL_PHOTOS;
  }
}

/** Ambil semua karya (foto + video) untuk halaman admin. */
export async function getAllWorks(): Promise<WorkRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = getSupabase()!;
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("position", { ascending: true });
    if (error || !data) return [];
    return data as WorkRow[];
  } catch {
    return [];
  }
}
