"use client";

import Image from "next/image";
import {
  placeLookupKey,
  useDestinationPhotosOptional,
} from "@/components/planner/DestinationPhotosContext";
import ImageCardSkeleton from "@/components/planner/ImageCardSkeleton";
import { getPlaceImageUrl } from "@/lib/place-images";

type PlaceImageProps = {
  place: string;
  destination: string;
  className?: string;
  /** e.g. aspect-video h-40 */
  aspectClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Stronger bottom gradient + title-safe zone (day cover cards) */
  variant?: "default" | "dayCover";
};

/**
 * Per-place Unsplash (batch API) when available, else destination pool, else curated hash URLs.
 */
export default function PlaceImage({
  place,
  destination,
  className = "",
  aspectClassName = "aspect-[16/10] min-h-[140px] sm:min-h-[160px]",
  priority = false,
  sizes = "(max-width: 640px) 100vw, min(520px, 45vw)",
  variant = "default",
}: PlaceImageProps) {
  const photosCtx = useDestinationPhotosOptional();
  const key = placeLookupKey(place);
  const batch = photosCtx?.placeByKey[key];
  const placesLoading = photosCtx?.placesLoading ?? false;

  const showBatchSkeleton = placesLoading && batch === undefined;

  const pooled = photosCtx?.pickForPlace(place, destination) ?? null;
  const resolved = batch !== undefined ? (batch ?? pooled) : pooled;
  const src = resolved?.src ?? getPlaceImageUrl(place, destination);
  const alt = resolved?.alt?.trim() ? resolved.alt : `Visual mood — ${place}`;

  const gradientClass =
    variant === "dayCover"
      ? "bg-gradient-to-t from-stone-950/75 via-stone-900/25 to-stone-800/15"
      : "bg-gradient-to-t from-stone-950/55 via-stone-900/10 to-transparent";

  return (
    <div
      className={`group relative w-full overflow-hidden bg-stone-200 shadow-inner ring-1 ring-black/[0.04] ${aspectClassName} ${className}`}
    >
      {showBatchSkeleton ? (
        <ImageCardSkeleton className="absolute inset-0 h-full min-h-full" />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          priority={priority}
        />
      )}
      <div className={`pointer-events-none absolute inset-0 ${gradientClass}`} aria-hidden />
      {resolved && !showBatchSkeleton ? (
        <a
          href={resolved.creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 left-2 right-2 z-[1] max-w-[calc(100%-1rem)] truncate text-[10px] font-medium text-white/95 underline-offset-2 hover:text-white hover:underline sm:bottom-2.5 sm:left-2.5 sm:right-auto sm:max-w-[85%]"
        >
          {resolved.creditName}
          <span className="text-white/65"> · Unsplash</span>
        </a>
      ) : null}
    </div>
  );
}
