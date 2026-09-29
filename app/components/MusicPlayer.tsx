"use client";

import { useState, useRef, useEffect } from "react";

// Ganti URL ini dengan musik pilihanmu (MP3 langsung)
const TRACKS = [
  {
    title: "Ambient Piano",
    artist: "Background Music",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Chill Vibes",
    artist: "Background Music",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Cinematic Mood",
    artist: "Background Music",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((currentTrack + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src={track.url}
        onEnded={nextTrack}
        preload="none"
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
          <p className="truncate text-xs text-white/50">{track.artist}</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={prevTrack}
              className="text-white/70 hover:text-white"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
            <button
              onClick={nextTrack}
              className="text-white/70 hover:text-white"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-white/30">
            {currentTrack + 1} / {TRACKS.length}
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
