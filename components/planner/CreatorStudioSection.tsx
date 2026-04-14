"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Aperture, Clapperboard, Sparkles } from "lucide-react";
import { useState } from "react";
import InstagramSpotsSection from "@/components/planner/InstagramSpotsSection";
import PhotoAnglesSection from "@/components/planner/PhotoAnglesSection";
import ReelCarousel from "@/components/planner/ReelCarousel";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";
import type { InstagramSpot, PhotoAngle, ReelIdea } from "@/lib/travel-plan";

type TabId = "spots" | "reels" | "angles";

const tabs: { id: TabId; label: string; short: string; icon: typeof Sparkles }[] = [
  { id: "spots", label: "Instagram spots", short: "Spots", icon: Sparkles },
  { id: "reels", label: "Reels & hooks", short: "Reels", icon: Clapperboard },
  { id: "angles", label: "Camera angles", short: "Angles", icon: Aperture },
];

type CreatorStudioSectionProps = {
  destination: string;
  instagramSpots: InstagramSpot[];
  reelIdeas: ReelIdea[];
  photoAngles: PhotoAngle[];
};

/**
 * Dedicated Creator Mode surface — tabbed, swipeable carousels, copy actions.
 */
export default function CreatorStudioSection({
  destination,
  instagramSpots,
  reelIdeas,
  photoAngles,
}: CreatorStudioSectionProps) {
  const dest = destination.trim() || "India";
  const [tab, setTab] = useState<TabId>("spots");

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.04]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 10% -10%, rgba(251, 191, 36, 0.22), transparent 50%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(139, 92, 246, 0.14), transparent 45%), linear-gradient(180deg, #fffdfb 0%, #fafaf9 40%, #ffffff 100%)",
        }}
      />
      <div className="relative px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
        <div className="mb-8 flex flex-col gap-6 border-b border-stone-200/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#c2410c]/20 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a3412] shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-amber-400 to-violet-500" aria-hidden />
              Creator Mode
            </p>
            <h3 className="mt-4 max-w-xl font-sans text-2xl font-light tracking-tight text-stone-900 sm:text-[1.75rem]">
              Your shoot kit for {dest}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-600">
              Photo spots with light windows, reel hooks & captions you can paste, and camera angles — wide, drone, and POV —
              tuned to this itinerary.
            </p>
          </div>
        </div>

        <div
          className="mb-6 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Creator content sections"
        >
          {tabs.map(({ id, label, short, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                id={`creator-tab-${id}`}
                aria-controls={`creator-panel-${id}`}
                onClick={() => setTab(id)}
                className={`flex min-w-0 shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-[background,border-color,box-shadow,color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]/40 sm:px-4 sm:text-[13px] ${
                  active
                    ? "border-stone-900/15 bg-stone-900 text-white shadow-[0_12px_36px_-16px_rgba(15,23,42,0.35)]"
                    : "border-stone-200/90 bg-white/90 text-stone-700 hover:border-stone-300"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            id={`creator-panel-${tab}`}
            aria-labelledby={`creator-tab-${tab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: EASE_APPLE_SOFT }}
          >
            {tab === "spots" ? (
              <InstagramSpotsSection spots={instagramSpots} destination={dest} variant="studio" />
            ) : null}
            {tab === "reels" ? (
              <ReelCarousel ideas={reelIdeas} destination={dest} variant="studio" />
            ) : null}
            {tab === "angles" ? (
              <PhotoAnglesSection angles={photoAngles} destination={dest} variant="studio" />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
