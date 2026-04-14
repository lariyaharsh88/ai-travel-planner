"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { type ReactNode } from "react";
import UnlockPremiumButton from "@/components/planner/UnlockPremiumButton";
import { EASE_APPLE } from "@/lib/motion-premium";

type PremiumLockedSectionProps = {
  locked: boolean;
  title: string;
  subtitle?: string;
  onUnlock: () => void;
  children: ReactNode;
  className?: string;
  /** Taller blurred preview for map / large blocks */
  previewHeightClass?: string;
};

/** Blur + structured preview + conversion CTA */
export default function PremiumLockedSection({
  locked,
  title,
  subtitle = "Full itinerary, hidden gems, creator kit, PDF & budget — one unlock.",
  onUnlock,
  children,
  className = "",
  previewHeightClass = "max-h-[min(28rem,70vh)]",
}: PremiumLockedSectionProps) {
  if (!locked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div
        className={`pointer-events-none ${previewHeightClass} min-h-[12rem] select-none overflow-hidden`}
      >
        <div className="h-full opacity-[0.38] blur-md saturate-[0.85]">{children}</div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-white/70 to-white/90"
          aria-hidden
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] flex flex-col justify-end bg-gradient-to-t from-white via-white/95 to-transparent sm:top-[22%]" />

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 p-6 text-center sm:p-8">
        <motion.span
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE_APPLE }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14120f] to-stone-800 text-white shadow-[0_12px_36px_-12px_rgba(15,23,42,0.45)] ring-2 ring-white/35"
        >
          <Lock className="h-6 w-6" strokeWidth={1.5} aria-hidden />
        </motion.span>
        <div className="max-w-md space-y-2">
          <p className="text-base font-semibold tracking-tight text-stone-900">{title}</p>
          <p className="text-sm leading-relaxed text-stone-600">{subtitle}</p>
        </div>

        <div className="w-full max-w-sm space-y-3 rounded-2xl border border-stone-200/80 bg-white/90 px-4 py-3 text-left shadow-sm backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Preview</p>
          <div className="space-y-2">
            <div className="h-2.5 w-[92%] rounded-full bg-gradient-to-r from-stone-200 to-stone-100" />
            <div className="h-2.5 w-[72%] rounded-full bg-gradient-to-r from-stone-200 to-stone-100" />
            <div className="h-2.5 w-[84%] rounded-full bg-gradient-to-r from-amber-100/90 to-stone-100" />
            <div className="h-2.5 w-[56%] rounded-full bg-gradient-to-r from-stone-200 to-stone-100" />
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Unlock to read real numbers, place names, and full routes — same plan, unblurred.
          </p>
        </div>

        <div className="pointer-events-auto">
          <UnlockPremiumButton onClick={onUnlock} size="lg" />
        </div>
        <p className="pointer-events-none text-[11px] font-medium text-stone-500">
          <span className="font-semibold text-stone-700">₹99</span> one-time · Razorpay secure checkout
        </p>
      </div>
    </div>
  );
}
