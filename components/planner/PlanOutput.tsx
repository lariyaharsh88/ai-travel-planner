"use client";

import { motion } from "framer-motion";
import { type ReactNode, useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdfDocument from "@/components/ItineraryPdfDocument";
import BlogSection from "@/components/planner/BlogSection";
import BudgetSection from "@/components/planner/BudgetSection";
import CreatorStudioSection from "@/components/planner/CreatorStudioSection";
import {
  DestinationPhotosProvider,
  useDestinationPhotosOptional,
} from "@/components/planner/DestinationPhotosContext";
import ItineraryDayCard from "@/components/planner/ItineraryDayCard";
import LockedItineraryDayCard from "@/components/planner/LockedItineraryDayCard";
import MapSection from "@/components/planner/MapSection";
import PremiumConversionBanner from "@/components/planner/PremiumConversionBanner";
import PremiumLockedSection from "@/components/planner/PremiumLockedSection";
import SectionHeader from "@/components/planner/SectionHeader";
import TripPlanHero from "@/components/planner/TripPlanHero";
import { EASE_APPLE_SOFT, sectionItemTransition } from "@/lib/motion-premium";
import { getPlaceImageUrl } from "@/lib/place-images";
import { type PlanMode } from "@/lib/plan-mode";
import { itineraryRouteForMap, placesForMap, type TravelPlanResponse } from "@/lib/travel-plan";

type PlanOutputProps = {
  result: TravelPlanResponse;
  destination: string;
  planMode: PlanMode;
  /** Paid unlock or legacy credits — full UI */
  hasPremiumAccess: boolean;
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

function PremiumPdfDownloadLink({
  result,
  destination,
}: {
  result: TravelPlanResponse;
  destination: string;
}) {
  const photos = useDestinationPhotosOptional();
  const coverImageUrl =
    photos?.heroPhoto?.src?.trim() || getPlaceImageUrl(destination, destination);

  return (
    <PDFDownloadLink
      document={
        <ItineraryPdfDocument
          result={result}
          destinationLabel={destination}
          coverImageUrl={coverImageUrl}
        />
      }
      fileName={`epic-india-${destination.replace(/\s+/g, "-").toLowerCase()}-itinerary.pdf`}
      className="inline-flex items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-6 py-3 text-sm font-medium text-stone-900 shadow-[0_8px_28px_-16px_rgba(15,23,42,0.1)] transition-[box-shadow,border-color] duration-500 hover:border-stone-300 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.12)]"
    >
      {({ loading }) => (loading ? "Preparing PDF…" : "Download PDF")}
    </PDFDownloadLink>
  );
}

export default function PlanOutput({
  result,
  destination,
  planMode,
  hasPremiumAccess,
  onUpgrade,
}: PlanOutputProps) {
  const mapRoute = useMemo(() => itineraryRouteForMap(result), [result]);
  const itineraryPlaces = useMemo(() => placesForMap(result), [result]);
  const dest = destination.trim() || "India";
  const creatorFirst = planMode === "creator";
  const isPremium = hasPremiumAccess;
  const totalDays = result.dayWisePlan.length;
  const showLimitedItinerary = !isPremium && totalDays > 1;

  const sectionBlocks: Record<string, ReactNode> = useMemo(
    () => ({
      ...(planMode === "creator"
        ? {
            creator_studio: (
              <motion.div key="creator_studio" variants={item} className="space-y-5">
                <PremiumLockedSection
                  locked={!isPremium}
                  title="Creator Mode — shoot kit"
                  subtitle="Reels, Instagram spots, camera angles & lighting notes for this exact route."
                  onUnlock={onUpgrade}
                >
                  <CreatorStudioSection
                    destination={dest}
                    instagramSpots={result.instagramSpots}
                    reelIdeas={result.reelIdeas}
                    photoAngles={result.photoAngles}
                  />
                </PremiumLockedSection>
              </motion.div>
            ),
          }
        : {}),
      itinerary: (
        <motion.div key="itinerary" variants={item} className="space-y-5">
          <SectionHeader
            eyebrow="Itinerary"
            title="Day by day"
            subtitle={
              showLimitedItinerary
                ? `Free preview · Day 1 only — unlock for all ${totalDays} days`
                : "Times, legs, and maps — built to use on the ground."
            }
          />
          <motion.div variants={dayCardStagger} initial="hidden" animate="visible" className="grid gap-6 md:gap-8">
            {result.dayWisePlan.map((dayPlan, i) => {
              if (!isPremium && i > 0) {
                return (
                  <motion.div key={dayPlan.day} variants={dayCardItem}>
                    <LockedItineraryDayCard dayPlan={dayPlan} onUnlock={onUpgrade} />
                  </motion.div>
                );
              }
              return (
                <motion.div key={dayPlan.day} variants={dayCardItem}>
                  <ItineraryDayCard
                    dayPlan={dayPlan}
                    destination={dest}
                    defaultOpen={i === 0}
                    isPremiumOutput={isPremium}
                  />
                </motion.div>
              );
            })}
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
          <PremiumLockedSection
            locked={!isPremium}
            title="Full route map & pins"
            subtitle="See every stop in order with directions — unlock to interact without blur."
            onUnlock={onUpgrade}
            previewHeightClass="min-h-[260px] max-h-[min(36rem,78vh)]"
          >
            <MapSection route={mapRoute} destination={dest} />
          </PremiumLockedSection>
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
            subtitle="Stay, food, and transport in INR — lines you can use when booking."
            onUnlock={onUpgrade}
          >
            <BudgetSection budget={result.budgetBreakdown} />
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
            subtitle="Headings and paragraphs you can publish or adapt."
            onUnlock={onUpgrade}
          >
            <BlogSection blog={result.blogContent} />
          </PremiumLockedSection>
        </motion.div>
      ),
    }),
    [dest, isPremium, mapRoute, onUpgrade, planMode, result, showLimitedItinerary, totalDays],
  );

  const sectionOrder = useMemo(() => {
    if (planMode !== "creator") {
      return ["itinerary", "map", "budget", "blog"] as const;
    }
    return creatorFirst
      ? (["creator_studio", "itinerary", "map", "budget", "blog"] as const)
      : (["itinerary", "map", "budget", "creator_studio", "blog"] as const);
  }, [planMode, creatorFirst]);

  return (
    <DestinationPhotosProvider destination={dest} places={itineraryPlaces}>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.65, ease: EASE_APPLE_SOFT }}
        className="w-full space-y-24 text-left md:space-y-32"
      >
        <TripPlanHero destination={dest} planMode={planMode} />

        {!isPremium ? <PremiumConversionBanner onUnlock={onUpgrade} /> : null}

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
              ) : (
                <span className="ml-3 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium tracking-[0.08em] text-emerald-800 ring-1 ring-emerald-200/80">
                  Premium
                </span>
              )}
            </p>
            <h2 className="type-display-lg mt-4 max-w-[22ch] text-balance">
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
              <PremiumPdfDownloadLink result={result} destination={dest} />
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

        <motion.div variants={list} initial="hidden" animate="visible" className="space-y-20 md:space-y-28">
          {sectionOrder.map((key) => sectionBlocks[key])}
        </motion.div>
      </motion.section>
    </DestinationPhotosProvider>
  );
}
