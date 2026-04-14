"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import PlaceImage from "@/components/planner/PlaceImage";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { InstagramSpot } from "@/lib/travel-plan";

type InstagramSpotsSectionProps = {
  spots: InstagramSpot[];
  destination: string;
};

export default function InstagramSpotsSection({ spots, destination }: InstagramSpotsSectionProps) {
  if (spots.length === 0) {
    return null;
  }

  const dest = destination.trim() || "India";

  return (
    <PremiumInteractiveCard className="p-4 sm:p-5" hoverLift={5}>
      <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
        {spots.map((spot, index) => (
          <motion.article
            key={`${spot.place}-${index}`}
            whileHover={{
              y: -4,
              transition: { duration: 0.45, ease: EASE_APPLE },
            }}
            whileTap={{ scale: 0.99 }}
            transition={springGentle}
            className="group/ig min-w-[min(100%,320px)] flex-[0_0_auto] snap-center overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-[box-shadow] duration-500 hover:shadow-[0_24px_48px_-20px_rgba(15,23,42,0.14)]"
          >
            <PlaceImage
              place={spot.place}
              destination={dest}
              aspectClassName="aspect-[4/3] min-h-[160px]"
              className="rounded-t-2xl"
            />
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold leading-snug text-stone-900">{spot.place}</p>
              <p className="text-sm leading-relaxed text-stone-600">{spot.whyItWorks}</p>
              <p className="text-xs font-medium text-[#9a3412]">
                <span className="text-stone-500">Best light: </span>
                {spot.bestTime}
              </p>
              <p className="rounded-xl bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-700 ring-1 ring-stone-100">
                <span className="font-semibold text-stone-900">Shot: </span>
                {spot.shotIdea}
              </p>
              {spot.mapsLink ? (
                <a
                  href={spot.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c2410c] underline-offset-2 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Maps
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </PremiumInteractiveCard>
  );
}
