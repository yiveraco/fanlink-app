"use client";

import { useParams, notFound } from "next/navigation";
import { FanLink } from "@/components/fanlink/Fanlink";
import { CircularLoader } from "@/components/ui/circular-loader";
import { useReleaseByUpc } from "@/hooks/useFanlink";

export default function FanlinkPage() {
  const params = useParams();
  const upc = params.slug as string;

  const { data, isLoading, isError } = useReleaseByUpc(upc);

  if (isLoading) {
    return <CircularLoader />;
  }

  if (isError || !data?.data) {
    notFound();
  }

  return <FanLink release={data.data.release} tracks={data.data.tracks} />;
}
