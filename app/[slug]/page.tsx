// app/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FanLinkClient } from "@/components/fanlink/FanlinkClient";
import { ReleaseAndTracksResponse } from "@/types/fanlink";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = "https://play.yivera.com";

function getApiHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
    Origin: SITE_URL,
    Referer: `${SITE_URL}/`,
    "User-Agent": "Mozilla/5.0 (compatible; Yivera/1.0)",
  };
}

async function fetchRelease(
  slug: string,
): Promise<ReleaseAndTracksResponse | null> {
  const url = `${BASE_URL}/everyone/get-release-by-slug/${slug}`;

  // console.log("[fanlink] fetching:", url);

  try {
    const res = await fetch(url, {
      headers: getApiHeaders(),
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.error("[fanlink] fetch failed:", res.status, res.statusText);
      const body = await res.text().catch(() => "");
      console.error("[fanlink] response body:", body);
      return null;
    }

    const json: ReleaseAndTracksResponse = await res.json();

    if (process.env.NODE_ENV === "development") {
      // Log a trimmed version — skip the huge peakData blobs
      const trimmed = {
        release: json.data?.release,
        tracks: json.data?.tracks?.map((t) => ({
          ...t,
          peakData: "[omitted]",
        })),
      };
      console.log("[fanlink] response:", JSON.stringify(trimmed, null, 2));
    }

    if (json.status !== "success" || !json.data) {
      console.error("[fanlink] unexpected response shape:", json);
      return null;
    }

    return json;
  } catch (err) {
    console.error("[fanlink] fetch error:", err);
    return null;
  }
}

// ============================================
// HELPERS
// ============================================

function getArtistName(data: ReleaseAndTracksResponse["data"]): string {
  const { release, tracks } = data;
  return (
    release.artists[0]?.artist ??
    tracks[0]?.artists.find((a) => a.artist)?.artist?.displayName ??
    "Unknown Artist"
  );
}

/**
 * Pull the full artist object (with social links) from the track artists array.
 * The release.artists array only has a name string; the track artists array
 * has the full artist entity with spotify, appleMusic, etc.
 */
// function getArtistEntity(
//   data: ReleaseAndTracksResponse["data"],
// ):
//   | ReleaseAndTracksResponse["data"]["tracks"][0]["artists"][0]["artist"]
//   | null {
//   for (const track of data.tracks) {
//     for (const a of track.artists) {
//       if (a.artist) return a.artist;
//     }
//   }
//   return null;
// }

type PageParams = Promise<{ slug: string }>;

// ============================================
// METADATA
// ============================================

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchRelease(slug);

  if (!data) {
    return {
      title: "Release Not Found",
      description: "This release could not be found on Yivera.",
    };
  }

  const { release, tracks } = data.data;
  const artistName = getArtistName(data.data);
  const releaseYear = new Date(release.releaseDate).getFullYear();
  const trackCount = tracks.length;
  const genre = release.primaryGenre;
  const title = `${release.releaseTitle} — ${artistName}`;

  const description =
    `Listen to "${release.releaseTitle}" by ${artistName}` +
    (genre ? ` · ${genre}` : "") +
    (release.releaseType === "ALBUM"
      ? ` · ${trackCount}-track album (${releaseYear})`
      : release.releaseType === "EP"
        ? ` · EP (${releaseYear})`
        : ` · Single (${releaseYear})`) +
    `. Stream on Spotify, Apple Music, Boomplay & more via Yivera.`;

  const coverArt = release.coverArt;
  const canonicalUrl = `${SITE_URL}/${slug}`;

  return {
    title,
    description,
    keywords: [
      artistName,
      release.releaseTitle,
      genre,
      release.subGenre,
      "stream",
      "listen",
      "music",
      "Yivera",
      "African music",
      "digital distribution",
      ...tracks.map((t) => t.trackTitle),
    ].filter(Boolean),

    alternates: { canonical: canonicalUrl },

    openGraph: {
      type: "music.album",
      url: canonicalUrl,
      title,
      description,
      siteName: "Yivera",
      // Square cover art — best for music link previews
      images: [
        {
          url: coverArt,
          width: 1200,
          height: 1200,
          alt: `${release.releaseTitle} by ${artistName}`,
        },
      ],
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverArt],
      site: "@YiveraDisto",
      creator: "@YiveraDisto",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ============================================
// JSON-LD STRUCTURED DATA
// ============================================

function ReleaseJsonLd({
  release,
  tracks,
  slug,
}: {
  release: ReleaseAndTracksResponse["data"]["release"];
  tracks: ReleaseAndTracksResponse["data"]["tracks"];
  slug: string;
}) {
  const artistName =
    release.artists[0]?.artist ??
    tracks[0]?.artists.find((a) => a.artist)?.artist?.displayName ??
    "Unknown Artist";

  const toDuration = (length: string) => {
    const parts = length.split(":").map(Number);
    if (parts.length === 3) return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
    if (parts.length === 2) return `PT${parts[0]}M${parts[1]}S`;
    return `PT${parts[0]}S`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": release.releaseType === "SINGLE" ? "MusicRecording" : "MusicAlbum",
    name: release.releaseTitle,
    image: release.coverArt,
    url: `${SITE_URL}/${slug}`,
    datePublished: release.releaseDate,
    genre: release.primaryGenre,
    byArtist: { "@type": "MusicGroup", name: artistName },
    ...(release.releaseType !== "SINGLE" && {
      numTracks: tracks.length,
      track: tracks.map((t, i) => ({
        "@type": "MusicRecording",
        position: i + 1,
        name: t.trackTitle,
        duration: toDuration(t.length),
        isrcCode: t.isrcCode,
      })),
    }),
    publisher: {
      "@type": "Organization",
      name: "Yivera",
      url: "https://yivera.com",
      logo: { "@type": "ImageObject", url: "https://yivera.com/logo.png" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// PAGE
// ============================================

export default async function FanlinkPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const data = await fetchRelease(slug);

  if (!data) notFound();

  const { release, tracks } = data.data;
  // const artistEntity = getArtistEntity(data.data);

  // Build social links from the artist entity — only include what exists
  // const socialLinks = [
  //   artistEntity?.spotify
  //     ? { platform: "spotify" as const, url: artistEntity.spotify }
  //     : null,
  //   artistEntity?.appleMusic
  //     ? { platform: "appleMusic" as const, url: artistEntity.appleMusic }
  //     : null,
  //   artistEntity?.instagram
  //     ? { platform: "instagram" as const, url: artistEntity.instagram }
  //     : null,
  //   artistEntity?.youtube
  //     ? { platform: "youtube" as const, url: artistEntity.youtube }
  //     : null,
  //   artistEntity?.youtubeMusic
  //     ? { platform: "youtubeMusic" as const, url: artistEntity.youtubeMusic }
  //     : null,
  //   artistEntity?.facebook
  //     ? { platform: "facebook" as const, url: artistEntity.facebook }
  //     : null,
  //   artistEntity?.twitter
  //     ? { platform: "twitter" as const, url: artistEntity.twitter }
  //     : null,
  //   artistEntity?.soundCloud
  //     ? { platform: "soundCloud" as const, url: artistEntity.soundCloud }
  //     : null,
  // ].filter(Boolean);

  return (
    <>
      <ReleaseJsonLd release={release} tracks={tracks} slug={slug} />
      <FanLinkClient
        release={release}
        tracks={tracks}
        // socialLinks={socialLinks}
      />
    </>
  );
}
