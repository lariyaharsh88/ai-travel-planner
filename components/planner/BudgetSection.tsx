"use client";

import { motion } from "framer-motion";
import { Bus, Home, IndianRupee, UtensilsCrossed } from "lucide-react";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { BudgetBreakdown, DayPlan } from "@/lib/travel-plan";

const categoryItems = [
  { key: "stay" as const, label: "Stay", icon: Home },
  { key: "food" as const, label: "Food", icon: UtensilsCrossed },
  { key: "transport" as const, label: "Transport", icon: Bus },
];

type BudgetSectionProps = {
  budget: BudgetBreakdown;
  dayWisePlan?: DayPlan[];
};

export default function BudgetSection({ budget, dayWisePlan = [] }: BudgetSectionProps) {
  const totalTripCost = budget.totalTripCost?.trim();

  return (
    <PremiumInteractiveCard className="p-5 sm:p-7" hoverLift={3}>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {categoryItems.map(({ key, label, icon: Icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.48, ease: EASE_APPLE }}
            whileHover={{
              y: -2,
              transition: { duration: 0.45, ease: EASE_APPLE },
            }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl border border-stone-100/90 bg-gradient-to-br from-white to-stone-50/90 p-4 shadow-sm transition-[box-shadow,border-color] duration-500 hover:border-stone-200 hover:shadow-[0_14px_36px_-14px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center gap-2 text-stone-500">
              <motion.span whileHover={{ y: -1 }} transition={{ duration: 0.35, ease: EASE_APPLE }}>
                <Icon className="h-4 w-4 text-[#ea580c]" strokeWidth={1.75} />
              </motion.span>
              <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springGentle}
              className="mt-3 text-lg font-semibold tracking-tight text-stone-900"
            >
              {budget[key]}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {dayWisePlan.length > 0 ? (
        <div className="mb-8">
          <p className="type-eyebrow mb-4 text-stone-500">Day-wise spend</p>
          <ul className="space-y-2">
            {dayWisePlan.map((day, i) => (
              <motion.li
                key={day.day}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * i, duration: 0.45, ease: EASE_APPLE }}
                className="flex items-start justify-between gap-4 rounded-xl border border-stone-100/90 bg-white/80 px-4 py-3 text-sm"
              >
                <span className="font-medium text-stone-800">
                  Day {day.day}
                  <span className="ml-2 font-normal text-stone-500">· {day.title}</span>
                </span>
                <span className="shrink-0 text-right font-medium tabular-nums text-stone-900">
                  {day.estimatedDayCost ?? "—"}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : null}

      {totalTripCost ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_APPLE }}
          className="flex flex-col gap-2 rounded-2xl border border-[#c2410c]/15 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 p-5 ring-1 ring-[#c2410c]/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-amber-100 shadow-md">
              <IndianRupee className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Total trip</p>
              <p className="mt-0.5 text-xs text-stone-600">Ballpark for the full run — refine when you book.</p>
            </div>
          </div>
          <p className="text-lg font-semibold tracking-tight text-stone-900 sm:text-right">{totalTripCost}</p>
        </motion.div>
      ) : null}
    </PremiumInteractiveCard>
  );
}
