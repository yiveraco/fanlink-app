// types/fanlink.ts

// ============================================
// ARTIST PROFILE
// Fields match the real API response exactly.
// ============================================

export interface ArtistProfile {
  id: string;
  businessId?: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  artistType?: string;
  wallet: string;
  gender: string | null;
  telephone: string | null;
  picture: string | null;
  biography: string | null;
  releaseFeed: "SHOW" | "HIDE";
  artistFeed: "SHOW" | "HIDE";
  address: string | null;
  state: string | null;
  postCode: string | null;
  country: string | null;
  // Streaming / social links
  appleMusic: string | null;
  facebook: string | null;
  soundCloud: string | null;
  spotify: string | null;
  twitter: string | null;
  youtube: string | null;
  youtubeMusic: string | null;
  instagram: string | null;
  website: string | null;
  signedContract: boolean;
  signature: string | null;
  signedDate: string | null;
  deleted: boolean;
  notified: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  labelId?: string | null;
}

// ============================================
// TRACK ARTIST
// Note: `artist` can be null for non-primary roles (Composer, Remixer, etc.)
// ============================================

export interface TrackArtist {
  id: number;
  name: string | null;
  role: string;
  trackId: string;
  artistId: string | null;
  createdAt: string;
  updatedAt: string;
  artist: ArtistProfile | null;
}

export interface ReleaseArtist {
  artistId: string;
  role: string;
  artist: string;
  picture: string | null;
  bio: string | null;
}

// ============================================
// TRACK
// ============================================

export interface Track {
  id: string;
  wav: string;
  mp3?: string; // Present in newer records
  shortWav?: string | null;
  trackTitle: string;
  mixName: string | null;
  trackNumber: number | null;
  length: string;
  sampleStartTime: string;
  sampleEndTime: string | null;
  genre: string | null;
  trackPrice: number | null;
  isrcCode: string;
  mixVersion: string | null;
  version?: string | null;
  explicitContent: "YES" | "NO";
  containsVocals: "YES" | "NO";
  hasInstrumentals: "YES" | "NO";
  language: string;
  publishedBy: string;
  composedBy: string;
  producer: string;
  lyricist: string;
  reMixer: string;
  lyrics: string;
  publishedLyrics: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  releaseId: string;
  artists: TrackArtist[];
  // Optional fields present in newer API versions
  peakData?: string | null;
  songWriter?: string | null;
  trackAiGenerated?: string | null;
}

// ============================================
// RELEASE
// ============================================

export type ReleaseType = "SINGLE" | "EP" | "ALBUM";
export type ReleaseStatus =
  | "PENDING"
  | "SUBMITTED"
  | "LIVE"
  | "DRAFT"
  | "REJECTED"
  | "TAKEDOWN";

export interface Release {
  id: string;
  releaseTitle: string;
  releaseType: ReleaseType;
  releaseDate: string;
  coverArt: string;
  primaryGenre: string;
  subGenre: string;
  mood: string | null;
  upc: string;
  status: ReleaseStatus;
  fanLink: string | null;
  artists: ReleaseArtist[];
}

// ============================================
// API RESPONSE
// ============================================

export interface ReleaseAndTracksData {
  release: Release;
  tracks: Track[];
}

export interface ReleaseAndTracksResponse {
  status: "success" | "error";
  message: string;
  data: ReleaseAndTracksData;
}
