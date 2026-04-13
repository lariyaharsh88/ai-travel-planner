"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdfDocument from "@/components/ItineraryPdfDocument";
import BlogSection from "@/components/planner/BlogSection";
import BudgetSection from "@/components/planner/BudgetSection";
import ItineraryDayCard from "@/components/planner/ItineraryDayCard";
import MapSection from "@/components/planner/MapSection";
import ReelCarousel from "@/components/planner/ReelCarousel";
import { EASE_APPLE } from "@/lib/motion-premium";
import type { TravelPlanResponse } from "@/lib/travel-plan";

type PlanOutputProps = {
  result: TravelPlanResponse;
};

const list = {
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
  hidden: {},
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: EASE_APPLE },
  },
};

export default function PlanOutput({ result }: PlanOutputProps) {
  const itineraryPlaces = useMemo(
    () =>
      Array.from(
        new Set(
          result.dayWisePlan.flatMap((dayPlan) =>
            dayPlan.places.map((place) => place.trim()).filter(Boolean),
          ),
        ),
      ),
    [result.dayWisePlan],
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="w-full space-y-5 text-left"
    >
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_APPLE }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Your trip</h2>
          <p className="mt-1 text-sm text-stone-500">Itinerary, map, budget, and content kit</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, transition: { duration: 0.4, ease: EASE_APPLE } }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex self-start sm:self-auto"
        >
          <PDFDownloadLink
            document={<ItineraryPdfDocument result={result} />}
            fileName="epic-india-itinerary.pdf"
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition-[box-shadow,border-color] duration-500 hover:border-[#FF6B35]/30 hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)]"
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
          <div className="grid gap-3">
            {result.dayWisePlan.map((dayPlan, i) => (
              <ItineraryDayCard key={dayPlan.day} dayPlan={dayPlan} defaultOpen={i === 0} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <MapSection places={itineraryPlaces} />
        </motion.div>

        <motion.div variants={item}>
          <BudgetSection budget={result.budgetBreakdown} />
        </motion.div>

        <motion.div variants={item}>
          <ReelCarousel ideas={result.reelIdeas} />
        </motion.div>

        <motion.div variants={item}>
          <BlogSection blog={result.blogContent} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
