"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { DayPlan } from "@/lib/travel-plan";
import UnlockPremiumButton from "@/components/planner/UnlockPremiumButton";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type LockedItineraryDayCardProps = {
  dayPlan: DayPlan;
  onUnlock: () => void;
};

/** Teaser for days beyond the free preview — blurred fake content + CTA */
export default function LockedItineraryDayCard({ dayPlan, onUnlock }: LockedItineraryDayCardProps) {
  const stopCount = dayPlan.schedule.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_APPLE_SOFT }}
      className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-stone-300/90 bg-gradient-to-br from-stone-50 to-white shadow-[0_8px_32px_-20px_rgba(15,23,42,0.08)]"
    >
      <div className="relative px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold tracking-tight text-stone-900 sm:text-lg">
              <span className="text-stone-500">Day {dayPlan.day}</span>
              <span className="text-stone-300"> · </span>
              {dayPlan.title}
            </h4>
            <p className="mt-2 text-xs text-stone-500">
              {stopCount} stop{stopCount === 1 ? "" : "s"} · full times, legs & tips in Premium
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-900/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            <Lock className="h-3 w-3" aria-hidden />
            Premium
          </span>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/50">
          <div className="pointer-events-none space-y-3 p-4 blur-[7px] select-none">
            <div className="h-3 w-[85%] max-w-[280px] rounded-full bg-stone-300/90" />
            <div className="h-3 w-[60%] max-w-[200px] rounded-full bg-stone-300/70" />
            <div className="h-16 w-full rounded-xl bg-stone-200/80" />
            <div className="h-3 w-full max-w-[320px] rounded-full bg-stone-300/60" />
            <div className="h-3 w-2/3 rounded-full bg-stone-300/50" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-white/95 via-white/80 to-white/40 p-5 text-center backdrop-blur-[2px]">
            <p className="max-w-xs text-sm font-medium text-stone-800">
              Unlock the full {stopCount}-stop day plan
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-stone-600">
              Hidden gems, exact legs, costs, and maps — included with Premium.
            </p>
            <UnlockPremiumButton onClick={onUnlock} size="sm" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
