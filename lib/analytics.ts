// lib/analytics.ts
// GA4 event tracking utility for Yivera Play fanlink.
// Script injection is handled by @next/third-parties via GoogleAnalytics component.
// This file only handles custom event tracking via window.gtag.

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Primary GA4 ID — same as main Yivera app
const GA_ID = "G-W7RFWFR0XN";

// ============================================
// EVENT NAMES
// ============================================
type GaEventName =
  | "share_button_open" // floating purple share button clicked
  | "share_copy_link" // copy link row clicked in modal
  | "share_social_click" // social platform clicked in modal
  | "streaming_service_click" // Spotify / Apple Music / Boomplay etc.
  | "audio_preview_play" // play button on cover art clicked
  | "audio_preview_pause"; // pause button on cover art clicked

interface GaEventParams {
  release_slug?: string;
  release_title?: string;
  artist_name?: string;
  platform?: string; // e.g. "whatsapp", "spotify", "apple_music"
  share_url?: string;
}

// ============================================
// TRACK EVENT
// Safe to call anywhere — silently no-ops in dev or before gtag loads.
// ============================================
export function trackEvent(eventName: GaEventName, params?: GaEventParams) {
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    process.env.NODE_ENV === "development"
  ) {
    return;
  }

  window.gtag("event", eventName, {
    ...params,
    send_to: GA_ID,
  });
}
