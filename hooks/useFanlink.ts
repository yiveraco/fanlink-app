// hooks/useFanlink.ts
import { useQuery } from "@tanstack/react-query";
import { getReleaseAndTracksByUpc } from "@/api/fanlink";
import { ReleaseAndTracksResponse } from "@/types/fanlink";

// ============================================
// QUERY KEYS
// ============================================

export const fanlinkKeys = {
  all: ["fanlink"] as const,
  releases: () => [...fanlinkKeys.all, "release"] as const,
  release: (upc: string) => [...fanlinkKeys.releases(), upc] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Fetch a release and its tracks by UPC.
 * Only runs when a valid UPC string is provided.
 *
 * @example
 * const { data, isLoading, error } = useReleaseByUpc("5057272881726");
 */
export function useReleaseByUpc(upc: string | null | undefined) {
  return useQuery<ReleaseAndTracksResponse, Error>({
    queryKey: fanlinkKeys.release(upc ?? ""),
    queryFn: () => getReleaseAndTracksByUpc(upc!),
    enabled: !!upc,
    staleTime: 5 * 60 * 1000, // 5 minutes — release data rarely changes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
