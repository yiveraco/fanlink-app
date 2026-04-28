"use client";
// components/fanlink/ShareModal.tsx

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  releaseTitle: string;
  artistName: string;
  coverArt: string;
  slug: string;
}

const SITE_URL = "https://play.yivera.com";

const SOCIAL_PLATFORMS = [
  {
    key: "twitter",
    label: "X/Twitter",
    bg: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (shareUrl: string, title: string, artist: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Listen to "${title}" by ${artist}`)}&url=${encodeURIComponent(shareUrl)}`,
  },
  {
    key: "whatsapp",
    label: "Whatsapp",
    bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (shareUrl: string, title: string, artist: string) =>
      `https://wa.me/?text=${encodeURIComponent(`Listen to "${title}" by ${artist} ${shareUrl}`)}`,
  },
  {
    key: "instagram",
    label: "Instagram",
    bg: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    getUrl: (shareUrl: string) =>
      // Instagram doesn't support direct share URLs — copy to clipboard fallback
      shareUrl,
    isInstagram: true,
  },
  {
    key: "facebook",
    label: "Facebook",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (shareUrl: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  },
  {
    key: "snapchat",
    label: "Snapchat",
    bg: "#FFFC00",
    textColor: "#000",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.2422 4C15.1378 4 18.076 4.25051 19.4648 7.36621L19.4658 7.36719C19.6778 7.83816 19.7739 8.53313 19.793 9.35449C19.8116 10.1572 19.7564 11.0195 19.7041 11.8105L19.6963 11.875L19.6934 11.8975L19.6924 11.9199C19.6879 12.0209 19.6813 12.1207 19.6748 12.2246C19.6684 12.3271 19.6621 12.4345 19.6572 12.5439L19.6455 12.7988L19.8457 12.957C19.9385 13.0308 20.2309 13.261 20.7734 13.2676L20.7832 13.2686L20.7939 13.2676C21.2206 13.2556 21.6522 13.1181 22.0918 12.9199C22.1443 12.8972 22.2006 12.8846 22.2578 12.8838C22.3285 12.884 22.4166 12.9029 22.5137 12.9355L22.5459 12.9453C22.6398 12.9856 22.7015 13.0318 22.7354 13.0684C22.7489 13.0831 22.7553 13.0943 22.7588 13.1006C22.7388 13.1497 22.6206 13.3418 22.0068 13.5898C21.9107 13.6259 21.8361 13.6552 21.748 13.6758L21.7314 13.6787L21.7158 13.6846C21.4704 13.7598 21.1201 13.8686 20.7979 14.0381C20.5209 14.1838 20.2102 14.4014 20.0137 14.7324L19.9404 14.874C19.7455 15.2956 19.8156 15.7567 19.9863 16.1729L20.0654 16.3486C20.0745 16.3676 20.0849 16.3861 20.0967 16.4043C20.2199 16.678 20.6296 17.5031 21.3643 18.3662C22.1506 19.29 23.3381 20.2906 24.9727 20.6709C24.8692 20.7348 24.7288 20.8045 24.5439 20.875C24.0895 21.0482 23.4334 21.2069 22.5752 21.3398L22.5732 21.3408C22.2107 21.3987 22.0579 21.7099 21.999 21.8516C21.9278 22.0231 21.8767 22.241 21.8311 22.4521L21.8301 22.4561C21.8027 22.5887 21.7697 22.7205 21.7354 22.8516C21.6315 22.8452 21.5276 22.8335 21.4258 22.8115H21.4248C20.9626 22.7132 20.4911 22.664 20.0186 22.665C19.7632 22.6658 19.5082 22.6824 19.2549 22.7139L19.0029 22.75C18.2252 22.8769 17.5732 23.3548 17.0127 23.752C16.1651 24.3304 15.3529 24.8925 14.1484 24.8926H13.8516C12.6389 24.8925 11.8309 24.3317 10.999 23.751C10.4351 23.3515 9.78849 22.8774 9.00488 22.7451H9.00586C8.75225 22.7017 8.49619 22.6749 8.23926 22.665L7.98438 22.6611C7.38296 22.6612 6.90252 22.7516 6.58203 22.8164C6.43303 22.8427 6.33729 22.8571 6.26855 22.8652C6.23353 22.7381 6.20578 22.612 6.17578 22.4697L6.1748 22.4668C6.12919 22.2559 6.0783 22.0388 6.00684 21.8672C5.94687 21.7233 5.79385 21.4161 5.43457 21.3564L5.42773 21.3555L4.82617 21.252C4.26153 21.1442 3.80728 21.0223 3.46582 20.8916C3.28361 20.8218 3.14406 20.7521 3.04004 20.6885C4.39342 20.3744 5.60007 19.6041 6.61523 18.4326C7.3161 17.6239 7.72591 16.8336 7.88184 16.4932L7.94043 16.3721C8.17238 15.8946 8.26834 15.3869 8.07129 14.916C7.8932 14.4902 7.53062 14.2283 7.21289 14.0625C6.89085 13.8945 6.53705 13.786 6.29199 13.71L6.2832 13.708L6.27441 13.7051L5.99023 13.6113C5.79093 13.5318 5.55943 13.421 5.39648 13.292C5.31519 13.2276 5.27292 13.1755 5.25488 13.1436C5.25062 13.1359 5.24812 13.1309 5.24707 13.1279C5.25218 13.1171 5.27741 13.0719 5.36816 13.0156C5.47354 12.9504 5.6031 12.9141 5.70117 12.9141H5.70898C5.75622 12.9134 5.76265 12.9222 5.74902 12.915L5.76172 12.9219L5.77441 12.9277C6.25643 13.1472 6.72932 13.2783 7.16797 13.2783C7.73242 13.2783 8.0615 13.0615 8.20312 12.9199L8.35938 12.7637L8.34863 12.543L8.30762 11.8389C8.255 11.0407 8.20025 10.1713 8.21973 9.36328C8.23949 8.54334 8.33516 7.84912 8.54492 7.37695C9.93363 4.26681 12.8722 4.00985 13.7686 4.00977L13.7803 4.00879L14.1953 4H14.2422Z"
          fill="white"
          stroke="#202020"
        />
      </svg>
    ),
    getUrl: (shareUrl: string) =>
      `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`,
  },
];

export function ShareModal({
  isOpen,
  onClose,
  releaseTitle,
  artistName,
  coverArt,
  slug,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${SITE_URL}/${slug}`;
  const shareText = `Listen to "${releaseTitle}" by ${artistName}`;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function handleSocialShare(platform: (typeof SOCIAL_PLATFORMS)[0]) {
    if (platform.isInstagram) {
      // Instagram: copy link then prompt
      handleCopy();
      return;
    }
    const url = platform.getUrl(shareUrl, releaseTitle, artistName);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* Modal */}
      <div
        className="relative w-full sm:w-[420px] rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: "#1a1a1a" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h2 className="text-white text-xl font-semibold tracking-tight">
            Share Fanlink
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="w-6 h-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cover Art */}
        <div
          className="mx-5 mb-4 rounded-2xl overflow-hidden aspect-square relative"
          style={{ background: "#111" }}
        >
          <Image
            src={coverArt}
            alt={`${releaseTitle} by ${artistName}`}
            fill
            sizes="420px"
            className="object-contain"
          />
        </div>

        {/* Copy Link Row */}
        <div className="mx-5 mb-6">
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors"
            style={{ background: "#2a2a2a" }}
          >
            {/* Link icon */}
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#3a3a3a" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-white font-semibold text-sm leading-none mb-1">
                {copied ? "Copied!" : "Copy Link"}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {shareText} {shareUrl}
              </p>
            </div>

            {/* Copy icon */}
            <div className="shrink-0 text-gray-400">
              {copied ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-around px-5 pb-8">
          {SOCIAL_PLATFORMS.map((platform) => (
            <button
              key={platform.key}
              onClick={() => handleSocialShare(platform)}
              className="flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              aria-label={`Share on ${platform.label}`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md"
                style={{
                  background: platform.bg,
                  color: platform.textColor ?? "white",
                }}
              >
                {platform.icon}
              </div>
              <span className="text-gray-400 text-xs font-medium">
                {platform.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
