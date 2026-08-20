"use client";
// components/fanlink/NotLiveYet.tsx

import { useState } from "react";
import { ReleaseStatus } from "@/types/fanlink";

interface NotLiveYetProps {
  releaseTitle: string;
  releaseDate: string;
  status: ReleaseStatus;
}

export function NotLiveYet({
  releaseTitle,
  releaseDate,
  status,
}: NotLiveYetProps) {
  // Read "now" once at mount via a lazy initializer — the sanctioned place
  // for an impure call. Deriving isFuture during render stays pure.
  const [now] = useState(() => Date.now());

  const date = new Date(releaseDate);
  const isValid = !Number.isNaN(date.getTime());
  const isFuture = isValid && date.getTime() > now;
  const formatted = isValid
    ? date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const { heading, body } = getCopy({
    status,
    isFuture,
    formatted,
    releaseTitle,
  });

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/4 px-6 py-10 text-center backdrop-blur-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <svg
          className="h-6 w-6 text-white/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white">{heading}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/60">
        {body}
      </p>
    </div>
  );
}

function getCopy({
  status,
  isFuture,
  formatted,
  releaseTitle,
}: {
  status: ReleaseStatus;
  isFuture: boolean;
  formatted: string | null;
  releaseTitle: string;
}): { heading: string; body: string } {
  const quoted = `\u201C${releaseTitle}\u201D`;

  switch (status) {
    // Live on our side, but store links haven't propagated in yet.
    case "LIVE":
      return {
        heading: "Streaming links on the way",
        body: `${quoted} is live — store links are still propagating and will appear here shortly.`,
      };

    // In the pipeline: submitted to stores or awaiting review.
    case "SUBMITTED":
    case "PENDING":
      return {
        heading: "Coming soon",
        body:
          isFuture && formatted
            ? `${quoted} drops on ${formatted}. Streaming links will appear here once it goes live.`
            : `${quoted} is on its way to stores. Streaming links will appear here once it goes live.`,
      };

    // Not yet submitted.
    case "DRAFT":
      return {
        heading: "Coming soon",
        body:
          isFuture && formatted
            ? `${quoted} is releasing on ${formatted}. Check back soon for streaming links.`
            : `${quoted} isn\u2019t on streaming platforms yet. Check back soon.`,
      };

    // Removed from stores.
    case "TAKEDOWN":
      return {
        heading: "No longer available",
        body: `${quoted} isn\u2019t currently available on streaming platforms.`,
      };

    case "REJECTED":
      return {
        heading: "Not available",
        body: `${quoted} isn\u2019t available on streaming platforms.`,
      };

    default:
      return {
        heading: "Not on stores yet",
        body: `${quoted} isn\u2019t on streaming platforms yet. Check back soon.`,
      };
  }
}
