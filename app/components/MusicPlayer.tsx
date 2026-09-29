"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Playlist: CC0 + NCS (royalty-free, boleh dipakai)
// 1-3: CC0 dari sapirca/timecues-studio | 4-7: NCS dari incrxyt/.mp3-files-for-terribledash
const TRACKS = [
  {
    title: "Phonk Remix",
    artist: "HoliznaCC0",
    src: "https://raw.githubusercontent.com/sapirca/timecues-studio/main/data-default/songs/phonk-remix/phonk-remix.mp3",
  },
  {
    title: "EDM At Midnight",
    artist: "Play House",
    src: "https://raw.githubusercontent.com/sapirca/timecues-studio/main/data-default/songs/edm-at-midnight/edm-at-midnight.mp3",
  },
  {
    title: "Pantheon",
    artist: "HoliznaCC0",
    src: "https://raw.githubusercontent.com/sapirca/timecues-studio/main/data-default/songs/pantheon/pantheon.mp3",
  },
  {
    title: "Button Masher",
    artist: "MDK",
    src: "https://raw.githubusercontent.com/incrxyt/.mp3-files-for-terribledash/main/MDK%20-%20Button%20Masher%20%5BNCS%20Release%5D.mp3",
  },
  {
    title: "Mortals (Funk Remix)",
    artist: "Warriyo, LXNGVX",
    src: "https://raw.githubusercontent.com/incrxyt/.mp3-files-for-terribledash/main/Warriyo%2C%20LXNGVX%20-%20Mortals%20Funk%20Remix%20%5BNCS%20Release%5D.mp3",
  },
  {
    title: "Mortals",
    artist: "Warriyo, Laura Brehm",
    src: "https://raw.githubusercontent.com/incrxyt/.mp3-files-for-terribledash/main/Warriyo%2C%20Laura%20Brehm%20-%20Mortals%20%28feat.%20Laura%20Brehm%29%20%5BNCS%20Release%5D.mp3",
  },
  {
    title: "a little break",
    artist: "youth®",
    src: "https://raw.githubusercontent.com/incrxyt/.mp3-files-for-terribledash/main/youth%C2%AE%20-%20a%20little%20break%20%5BNCS%20Release%5D.mp3",
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = TRACKS[currentTrack];

  // Download satu lagu sebagai file MP3
  const downloadTrack = useCallback(async (index: number) => {
    const t = TRACKS[index];
    const filename = `${t.title} - ${t.artist}.mp3`;
    setDownloading(filename);
    try {
      const res = await fetch(t.src);
      if (!res.ok) throw new Error("Gagal mengunduh");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: buka URL langsung kalau fetch gagal
      window.open(t.src, "_blank");
    } finally {
      setDownloading(null);
    }
  }, []);

  // Download semua lagu satu per satu
  const downloadAll = useCallback(async () => {
    for (let i = 0; i < TRACKS.length; i++) {
      await downloadTrack(i);
      // Jeda sebentar biar browser tidak blokir download beruntun
      await new Promise((r) => setTimeout(r, 800));
    }
  }, [downloadTrack]);

  const filteredTracks = TRACKS.map((t, i) => ({ ...t, index: i })).filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
  );

  const playTrack = useCallback((index: number) => {
    setCurrentTrack(index);
    const audio = audioRef.current;
    if (audio) {
      audio.src = TRACKS[index].src;
      audio.play().catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src) audio.src = track.src;
      audio.play().catch(() => {});
    }
  }, [isPlaying, track.src]);

  const nextTrack = useCallback(() => {
    playTrack((currentTrack + 1) % TRACKS.length);
  }, [currentTrack, playTrack]);

  const prevTrack = useCallback(() => {
    playTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length);
  }, [currentTrack, playTrack]);

  // Setup audio element + Media Session API (untuk background play & lock screen)
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setCurrentTrack((prev) => {
        const next = (prev + 1) % TRACKS.length;
        setTimeout(() => {
          const a = audioRef.current;
          if (a) {
            a.src = TRACKS[next].src;
            a.play().catch(() => {});
          }
        }, 0);
        return next;
      });
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    // Media Session API: kontrol dari lock screen / notifikasi
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", () => audio.play().catch(() => {}));
        navigator.mediaSession.setActionHandler("pause", () => audio.pause());
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          setCurrentTrack((prev) => {
            const idx = (prev - 1 + TRACKS.length) % TRACKS.length;
            setTimeout(() => {
              const a = audioRef.current;
              if (a) {
                a.src = TRACKS[idx].src;
                a.play().catch(() => {});
              }
            }, 0);
            return idx;
          });
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          setCurrentTrack((prev) => {
            const idx = (prev + 1) % TRACKS.length;
            setTimeout(() => {
              const a = audioRef.current;
              if (a) {
                a.src = TRACKS[idx].src;
                a.play().catch(() => {});
              }
            }, 0);
            return idx;
          });
        });
      } catch {
        // Abaikan kalau browser tidak support
      }
    }

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Update Media Session metadata saat lagu berganti
  useEffect(() => {
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: "Portofolio Music",
        });
      } catch {
        // Abaikan
      }
    }
  }, [track]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded ? (
        <div className="flex max-h-[70vh] w-72 flex-col border border-white/10 bg-black/95 backdrop-blur-md sm:w-80">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Now Playing</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">{track.title}</p>
              <p className="truncate text-xs text-white/50">{track.artist}</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="ml-2 shrink-0 text-white/50 hover:text-white"
              aria-label="Minimize"
            >
              ✕
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 border-b border-white/10 p-3">
            <button onClick={prevTrack} className="text-white/70 hover:text-white" aria-label="Previous">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:bg-white/90"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button onClick={nextTrack} className="text-white/70 hover:text-white" aria-label="Next">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="border-b border-white/10 p-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari lagu..."
              className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
            />
          </div>

          {/* Song list */}
          <div className="flex-1 overflow-y-auto">
            {filteredTracks.map((t) => (
              <div
                key={t.src}
                className={`flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5 ${
                  t.index === currentTrack ? "bg-white/10" : ""
                }`}
              >
                <button
                  onClick={() => playTrack(t.index)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="w-6 shrink-0 text-center text-xs text-white/40">
                    {t.index === currentTrack && isPlaying ? (
                      <span className="inline-flex items-end gap-0.5">
                        <span className="w-0.5 animate-pulse bg-white" style={{ height: "12px" }} />
                        <span className="w-0.5 animate-pulse bg-white" style={{ height: "8px", animationDelay: "0.2s" }} />
                        <span className="w-0.5 animate-pulse bg-white" style={{ height: "10px", animationDelay: "0.4s" }} />
                      </span>
                    ) : (
                      t.index + 1
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm ${t.index === currentTrack ? "font-semibold text-white" : "text-white/80"}`}>
                      {t.title}
                    </span>
                    <span className="block truncate text-xs text-white/40">{t.artist}</span>
                  </span>
                </button>
                <button
                  onClick={() => downloadTrack(t.index)}
                  disabled={downloading !== null}
                  className="shrink-0 p-1.5 text-white/40 hover:text-white disabled:opacity-50"
                  aria-label={`Download ${t.title}`}
                  title="Download MP3"
                >
                  {downloading === `${t.title} - ${t.artist}.mp3` ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
            {filteredTracks.length === 0 && (
              <p className="p-4 text-center text-sm text-white/40">Lagu tidak ditemukan</p>
            )}
          </div>

          <div className="border-t border-white/10 p-2">
            <button
              onClick={downloadAll}
              disabled={downloading !== null}
              className="w-full border border-white/20 py-2 text-xs tracking-[0.2em] text-white uppercase transition-colors hover:bg-white hover:text-black disabled:opacity-50"
            >
              {downloading ? `Mengunduh... ${downloading}` : `Download Semua (${TRACKS.length} Lagu)`}
            </button>
            <p className="mt-1.5 text-center text-[10px] text-white/30">
              {TRACKS.length} lagu • Tetap bunyi walau web di-minimize
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md hover:bg-black"
          aria-label="Open music player"
        >
          {isPlaying ? (
            <span className="flex items-end gap-1">
              <span className="w-1 animate-pulse bg-white" style={{ height: "16px" }} />
              <span className="w-1 animate-pulse bg-white" style={{ height: "10px", animationDelay: "0.2s" }} />
              <span className="w-1 animate-pulse bg-white" style={{ height: "14px", animationDelay: "0.4s" }} />
            </span>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
