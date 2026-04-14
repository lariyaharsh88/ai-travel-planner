"use client";

import { motion } from "framer-motion";
import { type ReactNode, useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdfDocument from "@/components/ItineraryPdfDocument";
import BlogSection from "@/components/planner/BlogSection";
import BudgetSection from "@/components/planner/BudgetSection";
import CreatorModeSection from "@/components/planner/CreatorModeSection";
import { DestinationPhotosProvider } from "@/components/planner/DestinationPhotosContext";
import ItineraryDayCard from "@/components/planner/ItineraryDayCard";
import InstagramSpotsSection from "@/components/planner/InstagramSpotsSection";
import MapSection from "@/components/planner/MapSection";
import PhotoAnglesSection from "@/components/planner/PhotoAnglesSection";
import PremiumLockedSection from "@/components/planner/PremiumLockedSection";
import ReelCarousel from "@/components/planner/ReelCarousel";
import SectionHeader from "@/components/planner/SectionHeader";
import TripPlanHero from "@/components/planner/TripPlanHero";
import { EASE_APPLE_SOFT, sectionItemTransition } from "@/lib/motion-premium";
import { type GenerationTier } from "@/lib/generation-tier";
import { type PlanMode } from "@/lib/plan-mode";
import { itineraryRouteForMap, type TravelPlanResponse } from "@/lib/travel-plan";

type PlanOutputProps = {
  result: TravelPlanResponse;
  /** Trip destination from the form — powers imagery & copy */
  destination: string;
  /** Mode used when this plan was generated */
  planMode: PlanMode;
  /** Free tier masks premium content */
  generationTier: GenerationTier;
  onUpgrade: () => void;
};

const list = {
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
  hidden: {},
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: sectionItemTransition,
  },
};

const dayCardStagger = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
  hidden: {},
};

const dayCardItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_APPLE_SOFT },
  },
};

export default function PlanOutput({
  result,
  destination,
  planMode,
  generationTier,
  onUpgrade,
}: PlanOutputProps) {
  const mapRoute = useMemo(() => itineraryRouteForMap(result), [result]);
  const dest = destination.trim() || "India";
  const creatorFirst = planMode === "creator";
  const isPremium = generationTier === "premium";

  const sectionBlocks: Record<string, ReactNode> = useMemo(
    () => ({
      itinerary: (
        <motion.div key="itinerary" variants={item} className="space-y-5">
          <SectionHeader
            eyebrow="Itinerary"
            title="Day by day"
            subtitle="Times, legs, and maps — built to use on the ground."
          />
          <motion.div variants={dayCardStagger} initial="hidden" animate="visible" className="grid gap-6 md:gap-8">
            {result.dayWisePlan.map((dayPlan, i) => (
              <motion.div key={dayPlan.day} variants={dayCardItem}>
                <ItineraryDayCard
                  dayPlan={dayPlan}
                  destination={dest}
                  defaultOpen={i === 0}
                  isPremiumOutput={isPremium}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ),
      map: (
        <motion.div key="map" variants={item} className="space-y-5">
          <SectionHeader
            eyebrow="Route"
            title="Map & path"
            subtitle="Pins in order, road-aware path, open in Google Maps."
          />
          <MapSection route={mapRoute} destination={dest} />
        </motion.div>
      ),
      budget: (
        <motion.div key="budget" variants={item} className="space-y-5">
          <SectionHeader
            eyebrow="Spend"
            title="Budget snapshot"
            subtitle="Rough split — refine when you book."
          />
          <PremiumLockedSection
            locked={!isPremium}
            title="Full budget breakdown"
            subtitle="See stay, food, and transport in one clear snapshot."
            onUnlock={onUpgrade}
          >
            <BudgetSection budget={result.budgetBreakdown} />
          </PremiumLockedSection>
        </motion.div>
      ),
      reels: (
        <motion.div key="reels" variants={item} className="space-y-5">
          <SectionHeader
            eyebrow="Short video"
            title="Reel scripts"
            subtitle="Hooks, scripts, captions — copy when you need them."
          />
          <PremiumLockedSection
            locked={!isPremium}
            title="Reel scripts & captions"
            onUnlock={onUpgrade}
          >
            <ReelCarousel ideas={result.reelIdeas} destination={dest} />
          </PremiumLockedSection>
        </motion.div>
      ),
      creator_bundle: (
        <motion.div key="creator_bundle" variants={item} className="space-y-5">
          <PremiumLockedSection
            locked={!isPremium}
            title="Creator mode — photo spots & angles"
            onUnlock={onUpgrade}
          >
            <CreatorModeSection
              destination={dest}
              spotsBlock={<InstagramSpotsSection spots={result.instagramSpots} destination={dest} />}
              anglesBlock={<PhotoAnglesSection angles={result.photoAngles} destination={dest} />}
            />
          </PremiumLockedSection>
        </motion.div>
      ),
      blog: (
        <motion.div key="blog" variants={item} className="space-y-5">
          <SectionHeader
            eyebrow="Story"
            title="Blog draft"
            subtitle="SEO outline with headings — expand into a post."
          />
          <PremiumLockedSection
            locked={!isPremium}
            title="SEO blog content"
            onUnlock={onUpgrade}
          >
            <BlogSection blog={result.blogContent} />
          </PremiumLockedSection>
        </motion.div>
      ),
    }),
    [dest, isPremium, mapRoute, onUpgrade, result],
  );

  const sectionOrder = creatorFirst
    ? (["reels", "creator_bundle", "itinerary", "map", "budget", "blog"] as const)
    : (["itinerary", "map", "budget", "reels", "creator_bundle", "blog"] as const);

  return (
    <DestinationPhotosProvider destination={dest}>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.65, ease: EASE_APPLE_SOFT }}
        className="w-full space-y-16 text-left md:space-y-24"
      >
        <TripPlanHero destination={dest} planMode={planMode} />

        <div className="flex flex-col items-stretch justify-between gap-8 border-b border-stone-200/80 pb-12 sm:flex-row sm:items-end sm:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_APPLE_SOFT }}
          >
            <p className="type-eyebrow text-[#c2410c]/90">
              {creatorFirst ? "Creator plan" : "Trip plan"}
              {!isPremium ? (
                <span className="ml-3 rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-medium tracking-[0.08em] text-stone-600">
                  Free preview
                </span>
              ) : null}
            </p>
            <h2 className="type-display mt-4 max-w-[20ch]">
              {creatorFirst ? `Shoot-ready plan for ${dest}` : `Trip plan for ${dest}`}
            </h2>
            <p className="type-body-muted mt-5 max-w-md">
              {creatorFirst
                ? "Creator content first — then route, map, and spend."
                : "Route and map first — then creator content if you post."}
            </p>
          </motion.div>
          <motion.div
            whileHover={isPremium ? { y: -1, transition: { duration: 0.5, ease: EASE_APPLE_SOFT } } : undefined}
            whileTap={isPremium ? { scale: 0.99 } : undefined}
            className="inline-flex self-start sm:self-auto"
          >
            {isPremium ? (
              <PDFDownloadLink
                document={<ItineraryPdfDocument result={result} destinationLabel={dest} />}
                fileName={`epic-india-${dest.replace(/\s+/g, "-").toLowerCase()}-itinerary.pdf`}
                className="inline-flex items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-6 py-3 text-sm font-medium text-stone-900 shadow-[0_8px_28px_-16px_rgba(15,23,42,0.1)] transition-[box-shadow,border-color] duration-500 hover:border-stone-300 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.12)]"
              >
                {({ loading }) => (loading ? "Preparing PDF…" : "Download PDF")}
              </PDFDownloadLink>
            ) : (
              <button
                type="button"
                onClick={onUpgrade}
                className="inline-flex items-center justify-center rounded-2xl border border-dashed border-stone-300/90 bg-transparent px-6 py-3 text-sm font-medium text-stone-500 transition hover:border-stone-400 hover:text-stone-700"
              >
                PDF — Unlock ₹99
              </button>
            )}
          </motion.div>
        </div>

        <motion.div variants={list} initial="hidden" animate="visible" className="space-y-16 md:space-y-24">
          {sectionOrder.map((key) => sectionBlocks[key])}
        </motion.div>
      </motion.section>
    </DestinationPhotosProvider>
  );
}
