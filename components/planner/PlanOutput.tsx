"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdfDocument from "@/components/ItineraryPdfDocument";
import BlogSection from "@/components/planner/BlogSection";
import BudgetSection from "@/components/planner/BudgetSection";
import ItineraryDayCard from "@/components/planner/ItineraryDayCard";
import InstagramSpotsSection from "@/components/planner/InstagramSpotsSection";
import MapSection from "@/components/planner/MapSection";
import PhotoAnglesSection from "@/components/planner/PhotoAnglesSection";
import ReelCarousel from "@/components/planner/ReelCarousel";
import { EASE_APPLE } from "@/lib/motion-premium";
import { itineraryRouteForMap, type TravelPlanResponse } from "@/lib/travel-plan";

type PlanOutputProps = {
  result: TravelPlanResponse;
};

const list = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
  hidden: {},
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_APPLE },
  },
};

const dayCardStagger = {
  visible: {
    transition: { staggerChildren: 0.085, delayChildren: 0.06 },
  },
  hidden: {},
};

const dayCardItem = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: EASE_APPLE },
  },
};

export default function PlanOutput({ result }: PlanOutputProps) {
  const mapRoute = useMemo(() => itineraryRouteForMap(result), [result]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="w-full space-y-5 text-left"
    >
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_APPLE }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Your trip</h2>
          <p className="mt-1 text-sm text-stone-500">
            Itinerary, map, budget, reels, Instagram spots & photo angles
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.35, ease: EASE_APPLE } }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex self-start sm:self-auto"
        >
          <PDFDownloadLink
            document={<ItineraryPdfDocument result={result} />}
            fileName="epic-india-itinerary.pdf"
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] transition-[box-shadow,border-color] duration-500 hover:border-[#FF6B35]/35 hover:shadow-[0_16px_40px_-14px_rgba(255,107,53,0.18)]"
          >
            {({ loading }) => (loading ? "Preparing PDF…" : "Download PDF")}
          </PDFDownloadLink>
        </motion.div>
      </div>

      <motion.div variants={list} initial="hidden" animate="visible" className="space-y-5">
        <motion.div variants={item} className="space-y-3">
          <div className="px-1">
            <h3 className="text-lg font-semibold text-stone-900">Day-by-day itinerary</h3>
            <p className="text-xs text-stone-500">Tap to expand each day</p>
          </div>
          <motion.div variants={dayCardStagger} initial="hidden" animate="visible" className="grid gap-3">
            {result.dayWisePlan.map((dayPlan, i) => (
              <motion.div key={dayPlan.day} variants={dayCardItem}>
                <ItineraryDayCard dayPlan={dayPlan} defaultOpen={i === 0} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <MapSection route={mapRoute} />
        </motion.div>

        <motion.div variants={item}>
          <BudgetSection budget={result.budgetBreakdown} />
        </motion.div>

        <motion.div variants={item}>
          <ReelCarousel ideas={result.reelIdeas} />
        </motion.div>

        <motion.div variants={item}>
          <InstagramSpotsSection spots={result.instagramSpots} />
        </motion.div>

        <motion.div variants={item}>
          <PhotoAnglesSection angles={result.photoAngles} />
        </motion.div>

        <motion.div variants={item}>
          <BlogSection blog={result.blogContent} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
