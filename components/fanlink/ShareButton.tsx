"use client";
// components/fanlink/ShareButton.tsx

import { trackEvent } from "@/lib/analytics";

interface ShareButtonProps {
  onClick: () => void;
  releaseTitle?: string;
  artistName?: string;
  releaseSlug?: string;
}

export function ShareButton({
  onClick,
  releaseTitle,
  artistName,
  releaseSlug,
}: ShareButtonProps) {
  function handleClick() {
    trackEvent("share_button_open", {
      release_title: releaseTitle,
      artist_name: artistName,
      release_slug: releaseSlug,
    });
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Share Fanlink"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{ background: "#7C3AED" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>
  );
}
