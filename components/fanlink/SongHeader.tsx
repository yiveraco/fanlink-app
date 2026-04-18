"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { SongHeaderProps } from "@/types";

export const SongHeader: React.FC<SongHeaderProps> = ({
  title,
  artist,
  coverImage,
  audioSnippetUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioError(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (audio.duration && duration === 0) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [duration]);

  useEffect(() => {
    const updateProgress = () => {
      const audio = audioRef.current;
      if (audio && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
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
  }, [isPlaying]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setAudioError(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;
    const newTime = percentage * audio.duration;

    audio.currentTime = newTime;
    setProgress(percentage * 100);
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <header className="flex flex-col items-center gap-4 sm:gap-6 w-full animate-fade-in">
      <audio ref={audioRef} preload="metadata">
        <source src={audioSnippetUrl} type="audio/mpeg" />
        <source
          src={audioSnippetUrl.replace(".mp3", ".ogg")}
          type="audio/ogg"
        />
        Your browser does not support the audio element.
      </audio>

      {/* Artwork */}
      <div className="relative w-full aspect-square max-w-full sm:max-w-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group">
        <Image
          src={coverImage}
          alt={`${title} by ${artist}`}
          fill
          sizes="(max-width: 640px) 95vw, 600px"
          className="object-cover transition-all duration-500"
          priority
          unoptimized
        />

        {/* Overlay — always slightly visible so the button reads against the art */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isPlaying ? "bg-black/50" : "bg-black/20 group-hover:bg-black/40"
          }`}
        />

        {/* Play / Pause button — ALWAYS visible, enhances on hover/playing */}
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

          {/* Preview hint — visible at rest, fades out while playing */}
          {!isPlaying && !audioError && (
            <span className="text-white/80 text-xs font-work-sans tracking-widest uppercase select-none drop-shadow">
              Preview
            </span>
          )}
        </div>

        {/* Progress bar at bottom of artwork */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-linear-to-r from-white via-white/90 to-white transition-all duration-100 ease-linear shadow-lg shadow-white/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Pulse border when playing */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl sm:rounded-2xl animate-pulse" />
          </div>
        )}
      </div>

      {/* Title + Artist */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 animate-slide-up relative">
        {/* Sound wave indicator — shows while playing */}
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

      {/* Progress bar + timestamps — shown below title when playing */}
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
