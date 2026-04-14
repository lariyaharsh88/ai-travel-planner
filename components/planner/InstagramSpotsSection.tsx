"use client";

import { motion } from "framer-motion";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import PlaceImage from "@/components/planner/PlaceImage";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { InstagramSpot } from "@/lib/travel-plan";

type InstagramSpotsSectionProps = {
  spots: InstagramSpot[];
  destination: string;
  /** Nested inside Creator Studio — no outer chrome card */
  variant?: "default" | "studio";
};

function lightingMoodLabel(bestTime: string): string | null {
  const t = bestTime.toLowerCase();
  if (/golden|sunset|blue\s*hour|dusk|dawn|magic/.test(t)) return "Prime light";
  if (/harsh|midday|noon|avoid/.test(t)) return "Watch light";
  return null;
}

export default function InstagramSpotsSection({
  spots,
  destination,
  variant = "default",
}: InstagramSpotsSectionProps) {
  const [copied, setCopied] = useState<number | null>(null);

  if (spots.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-4 py-8 text-center text-sm text-stone-500">
        No spots in this plan — try regenerating with Creator Mode on.
      </p>
    );
  }

  const dest = destination.trim() || "India";

  const inner = (
    <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
      {spots.map((spot, index) => {
        const mood = lightingMoodLabel(spot.bestTime);
        const copyText = `${spot.place}\n\n${spot.whyItWorks}\n\nBest light: ${spot.bestTime}\n\nShot: ${spot.shotIdea}`;
        return (
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
            <div className="relative">
              <PlaceImage
                place={spot.place}
                destination={dest}
                aspectClassName="aspect-[4/3] min-h-[160px]"
                className="rounded-t-2xl"
              />
              {mood ? (
                <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-md ring-1 ring-white/20">
                  {mood}
                </span>
              ) : null}
            </div>
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
              <div className="flex flex-wrap gap-2 pt-1">
                <motion.button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(copyText);
                    setCopied(index);
                    setTimeout(() => setCopied(null), 1500);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springGentle}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-[11px] font-semibold text-stone-800 shadow-sm min-[360px]:flex-initial"
                >
                  {copied === index ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {copied === index ? "Copied" : "Copy spot"}
                </motion.button>
                {spot.mapsLink ? (
                  <a
                    href={spot.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-stone-900 px-3 py-2 text-[11px] font-semibold text-white shadow-sm min-[360px]:flex-initial"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    Maps
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );

  if (variant === "studio") {
    return inner;
  }

  return <PremiumInteractiveCard className="p-4 sm:p-5" hoverLift={5}>{inner}</PremiumInteractiveCard>;
}
