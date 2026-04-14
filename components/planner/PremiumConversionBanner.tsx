"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import UnlockPremiumButton from "@/components/planner/UnlockPremiumButton";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type PremiumConversionBannerProps = {
  onUnlock: () => void;
};

/** Inline strip for free users — reinforces value without blocking the page */
export default function PremiumConversionBanner({ onUnlock }: PremiumConversionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_APPLE_SOFT }}
      className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-[0_8px_32px_-20px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.02] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-amber-100/50 to-transparent blur-2xl"
        aria-hidden
      />
      <div className="relative flex min-w-0 items-start gap-3 sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-amber-200/95 shadow-sm">
          <Crown className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-stone-900">Free preview</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-600 sm:text-[13px]">
            Full days, gems, creator kit, budget & PDF —{" "}
            <span className="font-semibold text-stone-800">₹99</span> once.
          </p>
        </div>
      </div>
      <div className="relative mt-4 shrink-0 sm:mt-0">
        <UnlockPremiumButton onClick={onUnlock} size="sm">
          Unlock Premium Travel Experience
        </UnlockPremiumButton>
      </div>
    </motion.div>
  );
}
