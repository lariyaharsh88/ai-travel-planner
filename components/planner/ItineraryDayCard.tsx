"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, ExternalLink, Footprints, Sparkles } from "lucide-react";
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
  const { whileHover, whileTap } = useCardHoverMotion(5);

  return (
    <motion.article
      layout
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white via-white to-stone-50/90 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_12px_40px_-12px_rgba(15,23,42,0.08),0_24px_56px_-20px_rgba(15,23,42,0.1)] transition-[box-shadow,border-color,transform] duration-500 hover:border-stone-200 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_20px_50px_-16px_rgba(15,23,42,0.12),0_0_0_1px_rgba(255,107,53,0.06)]"
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200/90 bg-white text-stone-600 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)] transition-shadow duration-300 group-hover:border-[#FF6B35]/25 group-hover:shadow-[0_4px_14px_-4px_rgba(255,107,53,0.2)]"
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
            transition={{ duration: 0.45, ease: EASE_APPLE }}
            className="border-t border-stone-100/90"
          >
            <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
              {dayPlan.schedule.map((stop, idx) => (
                <div key={`${dayPlan.day}-${idx}-${stop.place}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, ease: EASE_APPLE }}
                    className="relative rounded-xl border border-stone-100/90 bg-white/80 p-4 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-[#FF6B35]">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {stop.time}
                      </p>
                      {stop.hiddenGem ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200/80">
                          <Sparkles className="h-3 w-3" aria-hidden />
                          Hidden gem
                        </span>
                      ) : null}
                    </div>
                    <h5 className="mt-2 text-sm font-semibold text-stone-900">{stop.activity}</h5>
                    <p className="mt-0.5 text-sm text-stone-600">{stop.place}</p>
                    <p className="mt-2 text-xs font-medium text-stone-500">
                      Est. cost: <span className="text-stone-700">{stop.estimatedCost}</span>
                    </p>
                    {stop.localTip ? (
                      <p className="mt-2 rounded-lg bg-stone-50/90 px-3 py-2 text-xs leading-relaxed text-stone-600">
                        <span className="font-semibold text-stone-700">Tip: </span>
                        {stop.localTip}
                      </p>
                    ) : null}
                    <a
                      href={stop.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] underline-offset-2 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      Open in Google Maps
                    </a>
                  </motion.div>

                  {idx < dayPlan.travelLegs.length ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="my-3 ml-3 flex gap-3 border-l-2 border-dashed border-stone-200 pl-4"
                    >
                      <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
                      <div className="text-xs leading-relaxed text-stone-600">
                        <p className="font-medium text-stone-700">
                          {dayPlan.travelLegs[idx].duration}
                          {dayPlan.travelLegs[idx].mode ? (
                            <span className="font-normal text-stone-500">
                              {" "}
                              · {dayPlan.travelLegs[idx].mode}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {dayPlan.travelLegs[idx].fromPlace} → {dayPlan.travelLegs[idx].toPlace}
                        </p>
                        {dayPlan.travelLegs[idx].note ? (
                          <p className="mt-1 text-[11px] text-stone-500">{dayPlan.travelLegs[idx].note}</p>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
