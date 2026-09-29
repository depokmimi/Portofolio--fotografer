"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Ganti dengan ID video/playlist YouTube pilihanmu
// Contoh: "dQw4w9WgXcQ" adalah ID video (dari youtube.com/watch?v=dQw4w9WgXcQ)
// Untuk playlist, pakai: { type: "playlist", id: "PLAYLIST_ID" }
const YOUTUBE_PLAYLIST = [
  { title: "Lagu 1", videoId: "dQw4w9WgXcQ" },
  { title: "Lagu 2", videoId: "dQw4w9WgXcQ" },
  { title: "Lagu 3", videoId: "dQw4w9WgXcQ" },
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
  const playerRef = useRef<YTPlayer | null>(null);

  const track = YOUTUBE_PLAYLIST[currentTrack];

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
          // 1 = playing, 2 = paused, 0 = ended
          if (e.data === 1) setIsPlaying(true);
          else if (e.data === 2) setIsPlaying(false);
          else if (e.data === 0) {
            // Auto next
            const next = (currentTrack + 1) % YOUTUBE_PLAYLIST.length;
            setCurrentTrack(next);
            playerRef.current?.loadVideoById(YOUTUBE_PLAYLIST[next].videoId);
          }
        },
      },
    });
  }, [track.videoId, currentTrack]);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!document.getElementById("yt-iframe-api")) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
    window.onYouTubeIframeAPIReady = initPlayer;
    // Kalau API sudah loaded
    if (window.YT) initPlayer();
  }, [initPlayer]);

  useEffect(() => {
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(track.videoId);
      if (isPlaying) playerRef.current.playVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const nextTrack = () => {
    setCurrentTrack((currentTrack + 1) % YOUTUBE_PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrack((currentTrack - 1 + YOUTUBE_PLAYLIST.length) % YOUTUBE_PLAYLIST.length);
  };

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
        <div className="w-64 border border-white/10 bg-black/90 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Now Playing</p>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/50 hover:text-white"
              aria-label="Minimize"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 truncate text-sm font-semibold text-white">{track.title}</p>
          <p className="truncate text-xs text-white/50">YouTube Audio</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button onClick={prevTrack} className="text-white/70 hover:text-white" aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-white/30">
            {currentTrack + 1} / {YOUTUBE_PLAYLIST.length}
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
