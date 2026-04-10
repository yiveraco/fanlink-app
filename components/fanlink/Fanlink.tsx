"use client";
import React, { JSX } from "react";
import Image from "next/image";
import { Release, Track, ArtistProfile } from "@/types/fanlink";
import { SocialLink, StreamingService } from "@/types";
import { SongHeader } from "./SongHeader";
import { StreamingServices } from "./StreamingLinks";
import { Footer } from "./Footer";

// ============================================
// STREAMING PLATFORM ICON MAP
// ============================================
const STREAMING_ICON_MAP: { match: string; name: string; icon: string }[] = [
  { match: "spotify", name: "Spotify", icon: "/spotify.png" },
  { match: "apple", name: "Apple Music", icon: "/apple-music.svg" },
  { match: "boomplay", name: "Boomplay", icon: "/boomplay.png" },
  { match: "youtube", name: "YouTube Music", icon: "/youtube-music.png" },
  { match: "tidal", name: "Tidal", icon: "/tidal.png" },
  { match: "deezer", name: "Deezer", icon: "/deezer.png" },
  { match: "amazon", name: "Amazon Music", icon: "/amazon-music.svg" },
  { match: "resso", name: "Resso", icon: "/resso.png" },
  { match: "audiomack", name: "Audiomack", icon: "/audiomack.png" },
];

// ============================================
// SOCIAL ICONS
// ============================================
const SOCIAL_ICONS: Record<string, JSX.Element> = {
  instagram: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  facebook: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  soundCloud: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.56 8.87V17h8.76c1.48 0 2.68-1.17 2.68-2.62a2.65 2.65 0 0 0-2.24-2.6c.03-.2.04-.4.04-.6a5.37 5.37 0 0 0-5.37-5.37c-1.96 0-3.67 1.04-4.61 2.6M0 16.38A2.62 2.62 0 0 0 2.62 19h.91V13.5l-.78.5A2.62 2.62 0 0 0 0 16.38m4.4-6.7V19h1.75V9.68a2.62 2.62 0 0 0-1.75 0m2.62 0V19h1.75V8.93a5.43 5.43 0 0 0-1.75.75" />
    </svg>
  ),
  twitter: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  spotify: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  appleMusic: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.064-2.31-2.17-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208a4.93 4.93 0 0 0-.344 1.582c-.03.483-.05.967-.051 1.451-.002 4.919-.002 9.838 0 14.757 0 .5.019.996.09 1.492.14.968.49 1.858 1.08 2.63.563.74 1.283 1.26 2.15 1.58.52.193 1.06.293 1.61.327.578.035 1.157.044 1.737.044h11.62c.579 0 1.158-.01 1.737-.045.563-.034 1.11-.142 1.637-.35a4.98 4.98 0 0 0 2.017-1.423c.568-.69.914-1.478 1.073-2.355.075-.426.113-.856.115-1.29l.002-.145V6.124zm-7.647 10.985a2.37 2.37 0 0 1-2.375-2.364 2.37 2.37 0 0 1 2.375-2.363 2.37 2.37 0 0 1 2.374 2.363 2.37 2.37 0 0 1-2.374 2.364zm0-6.5V4.8l-5.602 1.496v9.283a2.37 2.37 0 0 1-2.374 2.363 2.37 2.37 0 0 1-2.374-2.363 2.37 2.37 0 0 1 2.374-2.363c.44 0 .85.12 1.2.33V3.716l8.15-2.18v8.985l-1.374.088z" />
    </svg>
  ),
};

// ============================================
// HELPERS
// ============================================

/**
 * Find the first track artist that has a full profile object.
 * The API returns multiple track artists (Performer, Composer, Remixer, etc.)
 * but only the one with artistId has a full `artist` profile.
 */
function getArtistProfile(tracks: Track[]): ArtistProfile | null {
  for (const track of tracks) {
    for (const ta of track.artists) {
      if (ta.artist) return ta.artist;
    }
  }
  return null;
}

/**
 * Build streaming services from the release fanLink.
 * Detects the platform by URL matching. Extend STREAMING_ICON_MAP for more stores.
 */
function buildStreamingServices(fanLink: string | null): StreamingService[] {
  if (!fanLink) return [];

  const lower = fanLink.toLowerCase();
  const matched = STREAMING_ICON_MAP.find(({ match }) => lower.includes(match));

  return [
    {
      name: matched?.name ?? "Listen Now",
      subtitle: "Stream the release",
      icon: matched?.icon ?? "/play.svg",
      url: fanLink,
    },
  ];
}

/**
 * Build social links from the artist profile.
 * Uses exact ArtistProfile keys so TypeScript stays happy.
 * Null / empty string fields are silently skipped.
 */
function buildSocialLinks(profile: ArtistProfile | null): SocialLink[] {
  if (!profile) return [];

  const candidates: { field: keyof ArtistProfile; iconKey: string }[] = [
    { field: "spotify", iconKey: "spotify" },
    { field: "instagram", iconKey: "instagram" },
    { field: "facebook", iconKey: "facebook" },
    { field: "twitter", iconKey: "twitter" },
    { field: "soundCloud", iconKey: "soundCloud" },
    { field: "appleMusic", iconKey: "appleMusic" },
  ];

  return candidates.reduce<SocialLink[]>((acc, { field, iconKey }) => {
    const href = profile[field];
    if (typeof href === "string" && href.trim() && SOCIAL_ICONS[iconKey]) {
      acc.push({ name: iconKey, href, svg: SOCIAL_ICONS[iconKey] });
    }
    return acc;
  }, []);
}

// ============================================
// COMPONENT
// ============================================

interface FanLinkProps {
  release: Release;
  tracks: Track[];
}

export const FanLink = ({ release, tracks }: FanLinkProps): JSX.Element => {
  const previewTrack = tracks[0];

  // Prefer mp3 for browser compatibility, fall back to wav
  const audioSnippetUrl = previewTrack?.mp3 ?? previewTrack?.wav ?? "";

  // Primary artist name — release level first, then first track artist profile
  const profile = getArtistProfile(tracks);
  const artistName =
    release.artists[0]?.artist ?? profile?.displayName ?? "Unknown Artist";

  const streamingServices = buildStreamingServices(release.fanLink);
  const socialLinks = buildSocialLinks(profile);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={release.coverArt}
            alt={release.releaseTitle}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
            quality={90}
            unoptimized
          />
        </div>
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(166, 41, 40, 0.3) 0%, rgba(31, 31, 31, 0.7) 40%, #1F1F1F 70%)",
          }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center gap-8 sm:gap-10 md:gap-12 px-4 sm:px-6 py-8 sm:py-12 md:py-16 mx-auto max-w-[95%] sm:max-w-[600px] min-h-screen">
        <SongHeader
          title={release.releaseTitle}
          artist={artistName}
          coverImage={release.coverArt}
          audioSnippetUrl={audioSnippetUrl}
        />

        {streamingServices.length > 0 && (
          <StreamingServices services={streamingServices} />
        )}

        <Footer artistName={artistName} socialLinks={socialLinks} />
      </main>
    </div>
  );
};
