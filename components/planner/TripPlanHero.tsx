"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useDestinationPhotosOptional } from "@/components/planner/DestinationPhotosContext";
import { getPlaceImageUrl } from "@/lib/place-images";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";
import { type PlanMode } from "@/lib/plan-mode";

type TripPlanHeroProps = {
  destination: string;
  planMode?: PlanMode;
};

export default function TripPlanHero({ destination, planMode = "creator" }: TripPlanHeroProps) {
  const place = destination.trim() || "India";
  const photosCtx = useDestinationPhotosOptional();
  const hero = photosCtx?.heroPhoto;
  const src = hero?.src ?? getPlaceImageUrl(place, place);
  const alt = hero?.alt?.trim() ? hero.alt : `${place} — trip hero`;
  const isCreator = planMode === "creator";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: EASE_APPLE_SOFT }}
      className="relative overflow-hidden rounded-[1.75rem] ring-1 ring-black/[0.05]"
    >
      <div className="relative aspect-[21/9] min-h-[180px] w-full sm:min-h-[220px] lg:aspect-[24/9]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, min(1152px, 100vw)"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-stone-900/25"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 lg:p-12">
          <p className="type-eyebrow text-amber-200/90">{isCreator ? "Creator dossier" : "Your trip"}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight text-white text-balance sm:text-4xl">
            {place}
          </h2>
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-white/85">
            {isCreator
              ? "Spots and scripts below — then your full route and map."
              : "Itinerary and map below — creator content when you need it."}
          </p>
          {hero ? (
            <a
              href={hero.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block max-w-full truncate text-[10px] font-medium tracking-wide text-white/55 hover:text-white/90"
            >
              {hero.creditName} · Unsplash
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
