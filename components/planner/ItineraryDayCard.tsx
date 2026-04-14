"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, ExternalLink, Footprints, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCardHoverMotion } from "@/hooks/useCardHoverMotion";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { DayPlan } from "@/lib/travel-plan";
import PlaceImage from "@/components/planner/PlaceImage";

type ItineraryDayCardProps = {
  dayPlan: DayPlan;
  destination: string;
  defaultOpen?: boolean;
  /** Full itinerary with hidden gems & tips; free tier masks gem detail */
  isPremiumOutput?: boolean;
};

export default function ItineraryDayCard({
  dayPlan,
  destination,
  defaultOpen = false,
  isPremiumOutput = true,
}: ItineraryDayCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { whileHover, whileTap } = useCardHoverMotion(5);
  const dest = destination.trim() || "India";
  const dayCoverPlace = dayPlan.schedule[0]?.place ?? dest;

  return (
    <motion.article
      layout
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="group overflow-hidden rounded-[1.75rem] border border-stone-200/70 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.08)] transition-[box-shadow,border-color] duration-500 hover:border-stone-300/80 hover:shadow-[0_16px_48px_-28px_rgba(15,23,42,0.1)]"
    >
      <div className="relative">
        <PlaceImage
          place={dayCoverPlace}
          destination={dest}
          aspectClassName="h-40 sm:h-48"
          className="rounded-t-[1.75rem]"
          priority={defaultOpen}
          variant="dayCover"
        />
        <div className="pointer-events-none absolute left-4 top-4 z-[2] rounded-full bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-md ring-1 ring-white/15">
          Day {dayPlan.day}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors duration-300 hover:bg-stone-50/80 sm:px-5"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2410c]">Day {dayPlan.day}</p>
          <h4 className="mt-1 truncate text-base font-semibold text-stone-900 sm:text-lg">{dayPlan.title}</h4>
          {dayPlan.estimatedDayCost ? (
            <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-stone-600">
              {isPremiumOutput ? (
                <>Day estimate: {dayPlan.estimatedDayCost}</>
              ) : (
                <>Day estimate: <span className="text-stone-400">Unlock Premium for full breakdown</span></>
              )}
            </p>
          ) : null}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={springGentle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200/90 bg-white text-stone-600 shadow-sm"
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
            className="border-t border-stone-100"
          >
            <div className="space-y-5 px-4 py-5 sm:px-5 sm:py-6">
              {dayPlan.schedule.map((stop, idx) => {
                const gemLocked = !isPremiumOutput && stop.hiddenGem;
                return (
                <div key={`${dayPlan.day}-${idx}-${stop.place}`}>
                  <div className="group/stop overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50/40 shadow-sm ring-1 ring-stone-100/80">
                    <div className={gemLocked ? "relative" : ""}>
                      <PlaceImage
                        place={stop.place}
                        destination={dest}
                        aspectClassName="aspect-[16/10] max-h-[220px] min-h-[140px]"
                        className="rounded-t-2xl"
                      />
                      {gemLocked ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-950/55 px-4 text-center backdrop-blur-[2px]">
                          <Sparkles className="h-5 w-5 text-amber-200" aria-hidden />
                          <p className="text-xs font-semibold text-white">Hidden gem — Premium</p>
                        </div>
                      ) : null}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, ease: EASE_APPLE }}
                      className="space-y-2 p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-[#c2410c]">
                            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {stop.timeSlot ?? stop.time}
                          </p>
                          {stop.timeSlot ? (
                            <p className="mt-0.5 text-[10px] font-medium tabular-nums text-stone-500">
                              Starts {stop.time}
                            </p>
                          ) : null}
                        </div>
                        {stop.hiddenGem && isPremiumOutput ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 ring-1 ring-amber-200/80">
                            <Sparkles className="h-3 w-3" aria-hidden />
                            Hidden gem
                          </span>
                        ) : null}
                      </div>
                      <h5 className="text-base font-semibold text-stone-900">
                        {gemLocked ? "Reserved stop — unlock to reveal" : stop.activity}
                      </h5>
                      <p className="text-sm text-stone-600">{gemLocked ? "••••••••" : stop.place}</p>
                      <p className="text-xs font-medium text-stone-500">
                        Cost:{" "}
                        <span className="text-stone-800">{gemLocked ? "—" : stop.estimatedCost}</span>
                      </p>
                      {!gemLocked && stop.localInsight ? (
                        <p className="rounded-xl border border-amber-100/90 bg-amber-50/60 px-3 py-2.5 text-xs leading-relaxed text-stone-800">
                          <span className="font-semibold text-amber-950">Local insight: </span>
                          {stop.localInsight}
                        </p>
                      ) : null}
                      {!gemLocked && stop.localTip ? (
                        <p className="rounded-xl bg-white px-3 py-2.5 text-xs leading-relaxed text-stone-600 ring-1 ring-stone-100">
                          <span className="font-semibold text-stone-800">Practical tip: </span>
                          {stop.localTip}
                        </p>
                      ) : null}
                      {!gemLocked ? (
                      <a
                        href={stop.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c2410c] underline-offset-2 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        View on Google Maps
                      </a>
                      ) : null}
                    </motion.div>
                  </div>

                  {idx < dayPlan.travelLegs.length ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="my-4 ml-2 flex gap-3 border-l-2 border-dashed border-stone-300 pl-4"
                    >
                      <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
                      <div className="text-xs leading-relaxed text-stone-600">
                        <p className="font-medium text-stone-800">
                          {dayPlan.travelLegs[idx].duration}
                          {dayPlan.travelLegs[idx].distance ? (
                            <span className="font-normal text-stone-500">
                              {" "}
                              · {dayPlan.travelLegs[idx].distance}
                            </span>
                          ) : null}
                          {dayPlan.travelLegs[idx].mode ? (
                            <span className="font-normal text-stone-500">
                              {" "}
                              · {dayPlan.travelLegs[idx].mode}
                            </span>
                          ) : null}
                          {dayPlan.travelLegs[idx].legCost ? (
                            <span className="font-normal text-stone-600">
                              {" "}
                              · {dayPlan.travelLegs[idx].legCost}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {dayPlan.travelLegs[idx].fromPlace} → {dayPlan.travelLegs[idx].toPlace}
                        </p>
                        {dayPlan.travelLegs[idx].route ? (
                          <p className="mt-1 text-[11px] leading-relaxed text-stone-700">
                            <span className="font-semibold text-stone-900">Route: </span>
                            {dayPlan.travelLegs[idx].route}
                          </p>
                        ) : null}
                        {dayPlan.travelLegs[idx].alternatives ? (
                          <p className="mt-1 text-[11px] leading-relaxed text-stone-600">
                            <span className="font-semibold text-stone-800">Also: </span>
                            {dayPlan.travelLegs[idx].alternatives}
                          </p>
                        ) : null}
                        {dayPlan.travelLegs[idx].note ? (
                          <p className="mt-1 text-[11px] text-stone-500">{dayPlan.travelLegs[idx].note}</p>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
