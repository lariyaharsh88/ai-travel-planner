"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { InstagramSpot } from "@/lib/travel-plan";

type InstagramSpotsSectionProps = {
  spots: InstagramSpot[];
};

export default function InstagramSpotsSection({ spots }: InstagramSpotsSectionProps) {
  if (spots.length === 0) {
    return null;
  }

  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E1306C] via-[#F77737] to-[#FCAF45] text-white shadow-md shadow-orange-500/20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:shadow-lg">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">Instagram spots</h3>
          <p className="text-xs text-stone-500">Where the feed actually pops — not generic landmark shots</p>
        </div>
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
        {spots.map((spot, index) => (
          <motion.article
            key={`${spot.place}-${index}`}
            whileHover={{
              y: -6,
              transition: { duration: 0.45, ease: EASE_APPLE },
            }}
            whileTap={{ scale: 0.99 }}
            transition={springGentle}
            className="min-w-[min(100%,340px)] flex-[0_0_auto] snap-center rounded-2xl border border-stone-100/90 bg-gradient-to-br from-rose-50/40 via-white to-amber-50/30 p-4 shadow-sm transition-[box-shadow] duration-500 hover:border-stone-200 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.14)]"
          >
            <p className="text-sm font-semibold leading-snug text-stone-900">{spot.place}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{spot.whyItWorks}</p>
            <p className="mt-3 text-xs font-medium text-[#c2410c]">
              <span className="text-stone-500">Best light: </span>
              {spot.bestTime}
            </p>
            <p className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-xs leading-relaxed text-stone-700 ring-1 ring-stone-100">
              <span className="font-semibold text-stone-800">Shot: </span>
              {spot.shotIdea}
            </p>
            {spot.mapsLink ? (
              <a
                href={spot.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] underline-offset-2 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                Maps
              </a>
            ) : null}
          </motion.article>
        ))}
      </div>
    </PremiumInteractiveCard>
  );
}
