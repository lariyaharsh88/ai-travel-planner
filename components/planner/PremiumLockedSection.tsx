"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { type ReactNode } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";

type PremiumLockedSectionProps = {
  locked: boolean;
  title: string;
  subtitle?: string;
  onUnlock: () => void;
  children: ReactNode;
  className?: string;
};

/** Blur + preview overlay for free-tier users */
export default function PremiumLockedSection({
  locked,
  title,
  subtitle = "Hidden gems, creator kit, PDF & full budget — one tap.",
  onUnlock,
  children,
  className = "",
}: PremiumLockedSectionProps) {
  if (!locked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div className="pointer-events-none max-h-[min(28rem,70vh)] select-none blur-sm opacity-[0.42]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white/75 via-white/85 to-amber-50/90 p-6 text-center backdrop-blur-md">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14120f] text-white shadow-lg ring-2 ring-white/30">
          <Lock className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        <p className="max-w-sm text-xs leading-relaxed text-stone-600">{subtitle}</p>
        <motion.button
          type="button"
          onClick={onUnlock}
          whileHover={{ scale: 1.02, transition: { duration: 0.35, ease: EASE_APPLE } }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-gradient-to-r from-[#c2410c] to-[#FF6B35] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(194,65,12,0.55)] ring-1 ring-white/20"
        >
          Unlock Premium Plan — ₹99
        </motion.button>
      </div>
    </div>
  );
}
