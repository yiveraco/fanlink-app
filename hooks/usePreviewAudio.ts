// hooks/usePreviewAudio.ts
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PREVIEW_SECONDS = 30;

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

interface Options {
  src: string;
  /** true when `src` is the full track and must be clipped */
  isFullTrack?: boolean;
  sampleStartTime?: string | null;
  sampleEndTime?: string | null;
  previewSeconds?: number;
}

export function usePreviewAudio({
  src,
  isFullTrack = false,
  sampleStartTime,
  sampleEndTime,
  previewSeconds = DEFAULT_PREVIEW_SECONDS,
}: Options) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // within the preview window
  const [duration, setDuration] = useState(0); // length of the preview window

  const startAt = isFullTrack ? parseTimeToSeconds(sampleStartTime) : 0;

  const computeEnd = useCallback(
    (audioDuration: number) => {
      const total = Number.isFinite(audioDuration) ? audioDuration : Infinity;
      if (!isFullTrack) return Number.isFinite(total) ? total : previewSeconds;
      const explicitEnd = parseTimeToSeconds(sampleEndTime);
      const cap = startAt + previewSeconds;
      const end = explicitEnd > startAt ? Math.min(explicitEnd, cap) : cap;
      return Math.min(end, total);
    },
    [isFullTrack, sampleEndTime, startAt, previewSeconds],
  );

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onLoaded = () => {
      setDuration(Math.max(0, computeEnd(audio.duration) - startAt));
      if (startAt > 0) audio.currentTime = startAt;
    };
    const onTimeUpdate = () => {
      const end = computeEnd(audio.duration);
      setCurrentTime(Math.max(0, audio.currentTime - startAt));
      if (audio.currentTime >= end) {
        audio.pause();
        audio.currentTime = startAt;
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    const onEnded = () => {
      audio.currentTime = startAt;
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, computeEnd, startAt]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (isFullTrack && audio.currentTime < startAt)
        audio.currentTime = startAt;
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isFullTrack, startAt]);

  const seek = useCallback(
    (fraction: number) => {
      const audio = audioRef.current;
      if (!audio || duration <= 0) return;
      audio.currentTime =
        startAt + Math.min(1, Math.max(0, fraction)) * duration;
    },
    [duration, startAt],
  );

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return { isPlaying, toggle, seek, progress, currentTime, duration };
}
