"use client";
// components/fanlink/StreamingLinks.tsx

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StreamingServicesProps } from "@/types";
import { trackEvent } from "@/lib/analytics";

// Accept optional release context so events carry full dimensions.
// FanLinkClient already has these values — just pass them through.
interface ExtendedStreamingServicesProps extends StreamingServicesProps {
  releaseTitle?: string;
  artistName?: string;
  releaseSlug?: string;
}

export const StreamingServices: React.FC<ExtendedStreamingServicesProps> = ({
  services,
  releaseTitle,
  artistName,
  releaseSlug,
}) => {
  const handleServiceClick = (service: { name: string; url?: string }) => {
    if (!service.url) return;

    trackEvent("streaming_service_click", {
      platform: service.name.toLowerCase().replace(/\s+/g, "_"), // "spotify", "apple_music", "youtube_music"
      release_title: releaseTitle,
      artist_name: artistName,
      release_slug: releaseSlug,
    });

    window.open(service.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="flex flex-col items-center gap-3 sm:gap-4 w-full animate-stagger">
      {services.map((service, index) => (
        <Card
          key={`${service.name}-${index}`}
          onClick={() => handleServiceClick(service)}
          style={{ animationDelay: `${index * 50}ms` }}
          className="group flex w-full h-20 sm:h-24 md:h-28 items-center justify-between px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-[#111111]/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]/95 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up"
        >
          <CardContent className="flex items-center gap-3 sm:gap-4 p-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src={service.icon}
                alt={`${service.name} logo`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1 overflow-hidden">
              <h3 className="font-work-sans font-medium text-white text-base sm:text-lg md:text-xl tracking-wide truncate group-hover:text-white/90 transition-colors">
                {service.name}
              </h3>
              <p className="font-work-sans text-white/60 text-sm sm:text-base tracking-wide truncate group-hover:text-white/70 transition-colors">
                {service.subtitle}
              </p>
            </div>
          </CardContent>

          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 p-0 hover:bg-transparent shrink-0 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handleServiceClick(service);
            }}
          >
            <Image
              src="/play.svg"
              alt="Open service"
              width={48}
              height={48}
              className="object-contain"
            />
          </Button>
        </Card>
      ))}
    </section>
  );
};
