"use client";

import { motion } from "framer-motion";
import { Bus, Home, UtensilsCrossed } from "lucide-react";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { BudgetBreakdown } from "@/lib/travel-plan";

const items = [
  { key: "stay" as const, label: "Stay", icon: Home },
  { key: "food" as const, label: "Food", icon: UtensilsCrossed },
  { key: "transport" as const, label: "Transport", icon: Bus },
];

type BudgetSectionProps = {
  budget: BudgetBreakdown;
};

export default function BudgetSection({ budget }: BudgetSectionProps) {
  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
      <h3 className="text-lg font-semibold text-stone-900">Budget breakdown</h3>
      <p className="mt-1 text-xs text-stone-500">Rough split to guide planning</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map(({ key, label, icon: Icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.48, ease: EASE_APPLE }}
            whileHover={{
              y: -4,
              transition: { duration: 0.42, ease: EASE_APPLE },
            }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl border border-stone-100/90 bg-gradient-to-br from-white to-stone-50/90 p-4 shadow-sm transition-[box-shadow,border-color] duration-500 hover:border-stone-200 hover:shadow-[0_14px_36px_-14px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center gap-2 text-stone-500">
              <motion.span whileHover={{ y: -1 }} transition={{ duration: 0.35, ease: EASE_APPLE }}>
                <Icon className="h-4 w-4 text-[#FF6B35]" strokeWidth={1.75} />
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
    </PremiumInteractiveCard>
  );
}
