"use client";

import Image from "next/image";
import { useDestinationPhotosOptional } from "@/components/planner/DestinationPhotosContext";
import { getPlaceImageUrl } from "@/lib/place-images";

type PlaceImageProps = {
  place: string;
  destination: string;
  className?: string;
  /** e.g. aspect-video h-40 */
  aspectClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Destination-tied photo: uses Unsplash Search (via context) when available,
 * otherwise curated static Unsplash URLs (deterministic hash).
 */
export default function PlaceImage({
  place,
  destination,
  className = "",
  aspectClassName = "aspect-[16/10] min-h-[140px] sm:min-h-[160px]",
  priority = false,
  sizes = "(max-width: 640px) 100vw, min(520px, 45vw)",
}: PlaceImageProps) {
  const photosCtx = useDestinationPhotosOptional();
  const picked = photosCtx?.pickForPlace(place, destination) ?? null;
  const src = picked?.src ?? getPlaceImageUrl(place, destination);
  const alt = picked?.alt?.trim() ? picked.alt : `Visual mood — ${place}`;

  return (
    <div className={`group relative w-full overflow-hidden bg-stone-200 ${aspectClassName} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        priority={priority}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-900/10 to-transparent"
        aria-hidden
      />
      {picked ? (
        <a
          href={picked.creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 left-2 right-2 z-[1] max-w-[calc(100%-1rem)] truncate text-[10px] font-medium text-white/90 underline-offset-2 hover:text-white hover:underline sm:bottom-2.5 sm:left-2.5 sm:right-auto sm:max-w-[85%]"
        >
          {picked.creditName}
          <span className="text-white/70"> · Unsplash</span>
        </a>
      ) : null}
    </div>
  );
}
