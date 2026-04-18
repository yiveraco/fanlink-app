// api/fanlink.ts
import apiClient from "@/lib/apiClient";
import { ReleaseAndTracksResponse } from "@/types/fanlink";

/**
 * Fetch a release and its tracks by UPC code.
 * Endpoint: GET /everyone/get-release-and-tracks/:upc
 */
export async function getReleaseAndTracksByUpc(
  upc: string,
): Promise<ReleaseAndTracksResponse> {
  const response = await apiClient.get<ReleaseAndTracksResponse>(
    `/everyone/get-release-and-tracks/${upc}`,
  );
  return response.data;
}

/**
 * Fetch a release and its tracks by slug.
 * Endpoint: GET /everyone/get-release-by-slug/:slug
 *
 * Example slug: "reflection-iba-philipiano"
 * The slug is stored as release.slug on the backend.
 */
export async function getReleaseBySlug(
  slug: string,
): Promise<ReleaseAndTracksResponse> {
  const response = await apiClient.get<ReleaseAndTracksResponse>(
    `/everyone/get-release-by-slug/${slug}`,
  );
  return response.data;
}
