"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Playlist dari Liked Music YouTube akun danraydepok@gmail.com
const YOUTUBE_PLAYLIST = [
  { title: "Dengarlah Bintang Hatiku", artist: "Demeises", videoId: "Hf2GqXgv_FU" },
  { title: "Invisible", artist: "Zeus X Crona & Julius Dreisig", videoId: "ytIGeNyR9Ng" },
  { title: "AVANGARD (Slowed + Reverb + Bass Boosted)", artist: "LONOWN", videoId: "t1z7u3qrKpI" },
  { title: "Di Sini Di Batas Kota Ini", artist: "Kapur Bagoes", videoId: "y1s1t3m1nd4" },
  { title: "Ada Rindu Untukmu", artist: "Vanny Vabiola", videoId: "1UE2-Go8apg" },
  { title: "AURA 1 Hour Viral Phonk Playlist 2026", artist: "EMPIRE PHONK", videoId: "7vFMAZD37X4" },
  { title: "DJ Campuran Viral TikTok Terbaru 2026", artist: "DJ XAVIER TEAM", videoId: "IzHSJ_5gUjY" },
  { title: "Last Kiss From Avelin - Sesak Dalam Gelap (Female Vocal)", artist: "GTX Music_ID", videoId: "KrrfW8wjDwo" },
  { title: "Last Kiss From Avelin - Sesak Dalam Gelap (Piano Version)", artist: "GTX Music_ID", videoId: "3OyLx02gNGg" },
  { title: "Lihat Lihatlah Bunga - OST Doraemon (Pop Punk Cover)", artist: "Bunny Stellar", videoId: "xBwJQGyLTYA" },
  { title: "The Fall", artist: "Her Last Sight", videoId: "mGwMrCN9zNY" },
  { title: "Darkside", artist: "Alan Walker, Au/Ra & Tomine Harket", videoId: "CXU7Xlf8wTI" },
  { title: "Cintaku Tak Terbatas Waktu", artist: "Anie Carera", videoId: "cFEvLH13Ies" },
  { title: "DJ Drop Enakeun V110 Full Bass", artist: "XDYNZ RMX", videoId: "oxzT_El3XgI" },
  { title: "Last Kiss From Avelin - Sesak Dalam Gelap (AI Cover)", artist: "GTX Music_ID", videoId: "2qxxjsx4Pk4" },
  { title: "Stick Stickly", artist: "Attack Attack!", videoId: "6QjBzZwdbuw" },
  { title: "Apology", artist: "Alesana", videoId: "ZSeb4yJeOo8" },
  { title: "Six", artist: "All That Remains", videoId: "CA_aMp-MvLE" },
  { title: "Mr. Highway's Thinking About The End", artist: "A Day To Remember", videoId: "oys9LZefDwQ" },
  { title: "Adista Ku Tak Bisa", artist: "david screamzz", videoId: "Z8-VUDhnsVI" },
  { title: "Adista: Ku Tak Bisa (Lyrics Video)", artist: "Zona Music", videoId: "B-JSIo-xs9g" },
  { title: "Disini Di Batas Kota Ini (Cover Vanny Vabiola)", artist: "Djadoel", videoId: "2ZI_QYYqxhU" },
  { title: "Bukan Aku Tak Cinta", artist: "Iklim", videoId: "88AG7KgmsbM" },
  { title: "Satu Rasa Cinta", artist: "Arief", videoId: "QR1sRkvE7m0" },
  { title: "Rela", artist: "Inka Christie", videoId: "P-OfDHDj3ws" },
];

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  getPlayerState(): number;
}

export default function YoutubeAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [search, setSearch] = useState("");
  const playerRef = useRef<YTPlayer | null>(null);

  const track = YOUTUBE_PLAYLIST[currentTrack];

  const filteredTracks = YOUTUBE_PLAYLIST.map((t, i) => ({ ...t, index: i })).filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
  );

  const playTrack = useCallback(
    (index: number) => {
      setCurrentTrack(index);
      if (playerRef.current && isReady) {
        playerRef.current.loadVideoById(YOUTUBE_PLAYLIST[index].videoId);
        playerRef.current.playVideo();
      }
    },
    [isReady]
  );

  const initPlayer = useCallback(() => {
    if (!window.YT || playerRef.current) return;
    playerRef.current = new window.YT.Player("yt-audio-player", {
      videoId: track.videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
      },
      events: {
        onReady: () => setIsReady(true),
        onStateChange: (e) => {
          if (e.data === 1) setIsPlaying(true);
          else if (e.data === 2) setIsPlaying(false);
          else if (e.data === 0) {
            const next = (currentTrack + 1) % YOUTUBE_PLAYLIST.length;
            playTrack(next);
          }
        },
      },
    });
  }, [track.videoId, currentTrack, playTrack]);

  useEffect(() => {
    if (!document.getElementById("yt-iframe-api")) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
    window.onYouTubeIframeAPIReady = initPlayer;
    if (window.YT) initPlayer();
  }, [initPlayer]);

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const nextTrack = () => playTrack((currentTrack + 1) % YOUTUBE_PLAYLIST.length);
  const prevTrack = () =>
    playTrack((currentTrack - 1 + YOUTUBE_PLAYLIST.length) % YOUTUBE_PLAYLIST.length);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Hidden YouTube player - audio only */}
      <div
        id="yt-audio-player"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      {isExpanded ? (
        <div className="flex max-h-[70vh] w-72 flex-col border border-white/10 bg-black/95 backdrop-blur-md sm:w-80">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div>
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
              disabled={!isReady}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-30"
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
              <button
                key={t.videoId}
                onClick={() => playTrack(t.index)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${
                  t.index === currentTrack ? "bg-white/10" : ""
                }`}
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
            ))}
            {filteredTracks.length === 0 && (
              <p className="p-4 text-center text-sm text-white/40">Lagu tidak ditemukan</p>
            )}
          </div>

          <p className="border-t border-white/10 p-2 text-center text-[10px] text-white/30">
            {YOUTUBE_PLAYLIST.length} lagu • YouTube Audio
          </p>
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
