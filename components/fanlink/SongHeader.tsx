"use client";
// components/fanlink/SongHeader.tsx

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { SongHeaderProps } from "@/types";
import { trackEvent } from "@/lib/analytics";

const PREVIEW_SECONDS = 30;

/** Parse "90", "1:30", or "00:01:30" into seconds. */
function parseTimeToSeconds(value?: string | null): number {
  if (!value) return 0;
  const trimmed = String(value).trim();
  if (!trimmed) return 0;
  if (!trimmed.includes(":")) {
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : 0;
  }
  return trimmed.split(":").reduce((acc, part) => {
    const n = Number(part);
    return Number.isFinite(n) ? acc * 60 + n : acc * 60;
  }, 0);
}

interface ExtendedSongHeaderProps extends SongHeaderProps {
  releaseSlug?: string;
  artistName?: string;
  /** true when audioSnippetUrl is the full track and must be clipped to 30s */
  isFullTrack?: boolean;
  sampleStartTime?: string | null;
  sampleEndTime?: string | null;
}

export const SongHeader: React.FC<ExtendedSongHeaderProps> = ({
  title,
  artist,
  coverImage,
  audioSnippetUrl,
  releaseSlug,
  artistName,
  isFullTrack = false,
  sampleStartTime,
  sampleEndTime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0); // length of the preview window
  const [currentTime, setCurrentTime] = useState(0); // position within the window
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Window bounds. startAt is 0 for a shortWav clip.
  const startAt = isFullTrack ? parseTimeToSeconds(sampleStartTime) : 0;
  const endAtRef = useRef<number>(Infinity);

  const eventDimensions = {
    release_title: title,
    artist_name: artistName ?? artist,
    release_slug: releaseSlug,
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const computeEnd = (audioDuration: number) => {
      const total = Number.isFinite(audioDuration) ? audioDuration : Infinity;
      if (!isFullTrack) return total;
      const explicitEnd = parseTimeToSeconds(sampleEndTime);
      const cap = startAt + PREVIEW_SECONDS;
      const end = explicitEnd > startAt ? Math.min(explicitEnd, cap) : cap;
      return Math.min(end, total);
    };

    const handleLoadedMetadata = () => {
      const end = computeEnd(audio.duration);
      endAtRef.current = end;
      setDuration(Math.max(0, end - startAt));
      setAudioError(false);
      if (startAt > 0 && audio.currentTime < startAt) {
        audio.currentTime = startAt;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      audio.currentTime = startAt;
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (audio.duration && duration === 0) {
        const end = computeEnd(audio.duration);
        endAtRef.current = end;
        setDuration(Math.max(0, end - startAt));
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    if (audio.duration && !Number.isNaN(audio.duration)) {
      handleLoadedMetadata();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioSnippetUrl, isFullTrack, sampleEndTime, startAt, duration]);

  useEffect(() => {
    const updateProgress = () => {
      const audio = audioRef.current;
      if (audio) {
        const end = endAtRef.current;

        // Hard stop at the end of the preview window.
        if (audio.currentTime >= end) {
          audio.pause();
          audio.currentTime = startAt;
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
          return;
        }

        const windowDur = Math.max(0, end - startAt);
        const rel = Math.max(0, audio.currentTime - startAt);
        setCurrentTime(rel);
        setProgress(windowDur > 0 ? (rel / windowDur) * 100 : 0);
      }
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, startAt]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        trackEvent("audio_preview_pause", eventDimensions);
      } else {
        // If we're outside the window (fresh start or after a stop), reset.
        if (
          audio.currentTime < startAt ||
          audio.currentTime >= endAtRef.current
        ) {
          audio.currentTime = startAt;
        }
        await audio.play();
        setIsPlaying(true);
        trackEvent("audio_preview_play", eventDimensions);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setAudioError(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = Math.min(1, Math.max(0, x / bounds.width));
    const windowDur = Math.max(0, endAtRef.current - startAt);
    const newTime = startAt + percentage * windowDur;

    audio.currentTime = newTime;
    setProgress(percentage * 100);
    setCurrentTime(percentage * windowDur);
  };

  const formatTime = (time: number): string => {
    if (Number.isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <header className="flex flex-col items-center gap-4 sm:gap-6 w-full animate-fade-in">
      {/* Direct src lets the browser sniff wav vs mp3 — no wrong type hint */}
      <audio ref={audioRef} src={audioSnippetUrl} preload="metadata">
        Your browser does not support the audio element.
      </audio>

      {/* Artwork */}
      <div className="relative w-full aspect-square max-w-full sm:max-w-150 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group">
        <Image
          src={coverImage}
          alt={`${title} by ${artist}`}
          fill
          sizes="(max-width: 640px) 95vw, 600px"
          className="object-cover transition-all duration-500"
          priority
          unoptimized
        />

        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isPlaying ? "bg-black/50" : "bg-black/20 group-hover:bg-black/40"
          }`}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Button
            onClick={togglePlayPause}
            size="icon"
            disabled={audioError}
            className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl
              transition-all duration-300
              ${audioError ? "opacity-40 cursor-not-allowed" : ""}
              ${
                isPlaying
                  ? "bg-white hover:bg-white scale-110"
                  : "bg-white/80 hover:bg-white group-hover:scale-110 scale-100"
              }
            `}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
            )}
          </Button>

          {!isPlaying && !audioError && (
            <span className="text-white/80 text-xs font-work-sans tracking-widest uppercase select-none drop-shadow">
              Preview
            </span>
          )}
        </div>

        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-linear-to-r from-white via-white/90 to-white transition-all duration-100 ease-linear shadow-lg shadow-white/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl sm:rounded-2xl animate-pulse" />
          </div>
        )}
      </div>

      {/* Title + Artist */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 animate-slide-up relative">
        {isPlaying && (
          <div className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 flex items-end gap-1">
            <div className="w-1 bg-linear-to-t from-white/90 to-white/60 rounded-full animate-sound-wave-1 shadow-sm" />
            <div className="w-1 bg-linear-to-t from-white/90 to-white/60 rounded-full animate-sound-wave-2 shadow-sm" />
            <div className="w-1 bg-linear-to-t from-white/90 to-white/60 rounded-full animate-sound-wave-3 shadow-sm" />
            <div className="w-1 bg-linear-to-t from-white/90 to-white/60 rounded-full animate-sound-wave-4 shadow-sm" />
            <div className="w-1 bg-linear-to-t from-white/90 to-white/60 rounded-full animate-sound-wave-5 shadow-sm" />
          </div>
        )}
        <h1 className="font-plus-jakarta font-extrabold text-white text-4xl sm:text-5xl md:text-[52px] leading-tight tracking-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="font-work-sans text-white/70 text-xl sm:text-2xl tracking-wide">
          {artist}
        </p>
      </div>

      {/* Progress bar + timestamps */}
      {isPlaying && (
        <div className="w-full max-w-md flex flex-col gap-3 animate-fade-in">
          <div className="flex justify-between text-xs text-white/50 font-work-sans font-medium">
            <span className="animate-pulse-subtle">
              {formatTime(currentTime)}
            </span>
            <span className="text-white/30">◆</span>
            <span className="text-white/60">{formatTime(duration)}</span>
          </div>
          <div
            onClick={handleSeek}
            className="relative h-2 bg-white/10 rounded-full cursor-pointer overflow-visible backdrop-blur-sm group/progress"
          >
            <div
              className="absolute inset-0 bg-white/5 blur-sm rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/90 rounded-full transition-all duration-100 ease-linear shadow-lg"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute inset-y-0 w-16 bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer rounded-full"
              style={{ left: `${Math.max(0, progress - 8)}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-white/50 opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{
                left: `${progress}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
