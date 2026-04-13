"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Compass, Utensils } from "lucide-react";
import { useState } from "react";
import { useCardHoverMotion } from "@/hooks/useCardHoverMotion";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { DayPlan } from "@/lib/travel-plan";

type ItineraryDayCardProps = {
  dayPlan: DayPlan;
  defaultOpen?: boolean;
};

export default function ItineraryDayCard({ dayPlan, defaultOpen = false }: ItineraryDayCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { whileHover, whileTap } = useCardHoverMotion(4);

  return (
    <motion.article
      layout
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="group overflow-hidden rounded-2xl border border-stone-200/85 bg-gradient-to-br from-white to-stone-50/80 shadow-[0_10px_36px_-22px_rgba(15,23,42,0.12)] transition-[box-shadow,border-color] duration-500 hover:border-stone-200 hover:shadow-[0_22px_50px_-18px_rgba(15,23,42,0.14)]"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors duration-300 hover:bg-stone-50/90 sm:px-5"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B35]">Day {dayPlan.day}</p>
          <h4 className="mt-1 truncate text-base font-semibold text-stone-900 sm:text-lg">{dayPlan.title}</h4>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={springGentle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition-shadow duration-300 group-hover:border-stone-300 group-hover:shadow-md"
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE_APPLE }}
            className="border-t border-stone-100"
          >
            <div className="grid gap-5 px-4 py-4 sm:grid-cols-2 sm:px-5 sm:py-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  <Compass className="h-3.5 w-3.5 text-[#FF6B35]" aria-hidden />
                  Activities
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
                  {dayPlan.activities.map((activity) => (
                    <motion.li
                      key={activity}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, ease: EASE_APPLE }}
                      className="flex gap-2"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]" />
                      {activity}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  <Utensils className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                  Places
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
                  {dayPlan.places.map((place) => (
                    <motion.li
                      key={place}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, ease: EASE_APPLE }}
                      className="flex gap-2"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                      {place}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
