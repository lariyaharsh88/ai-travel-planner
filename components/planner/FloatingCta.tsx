"use client";

import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type FloatingCtaProps = {
  onClick: () => void;
  /** Second action when user has a plan but is still on free tier */
  onUnlock?: () => void;
  showUpgrade?: boolean;
};

const hoverLift = {
  scale: 1.02,
  transition: { duration: 0.5, ease: EASE_APPLE_SOFT },
};

export default function FloatingCta({ onClick, onUnlock, showUpgrade = false }: FloatingCtaProps) {
  return (
    <>
      <motion.div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-40 hidden gap-2 sm:flex sm:flex-col sm:items-end">
        {showUpgrade && onUnlock ? (
          <motion.button
            type="button"
            onClick={onUnlock}
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#c2410c] to-[#ea580c] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_36px_-14px_rgba(194,65,12,0.5)] ring-1 ring-white/20"
            whileHover={hoverLift}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_APPLE_SOFT }}
            aria-label="Unlock Premium Travel Experience"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Unlock — ₹99
          </motion.button>
        ) : null}
        <motion.button
          type="button"
          onClick={onClick}
          className="flex min-h-[44px] items-center gap-2 rounded-full bg-[#14120f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)] ring-1 ring-white/10"
          whileHover={hoverLift}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.4, ease: EASE_APPLE_SOFT }}
          aria-label="Scroll to plan form"
        >
          <motion.span whileHover={{ y: -1 }} transition={{ duration: 0.35, ease: EASE_APPLE_SOFT }}>
            <ArrowUp className="h-4 w-4" aria-hidden />
          </motion.span>
          Plan a trip
        </motion.button>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-0 border-t border-stone-200/60 bg-[var(--surface-page)]/80 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_40px_-12px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:hidden">
        {showUpgrade && onUnlock ? (
          <motion.button
            type="button"
            onClick={onUnlock}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 bg-gradient-to-r from-[#c2410c] to-[#ea580c] px-5 py-3.5 text-sm font-semibold text-white"
            whileTap={{ scale: 0.995 }}
            transition={{ duration: 0.25, ease: EASE_APPLE_SOFT }}
            aria-label="Unlock Premium Travel Experience"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Unlock Premium — ₹99
          </motion.button>
        ) : null}
        <motion.button
          type="button"
          onClick={onClick}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 bg-[#14120f] px-5 py-4 text-sm font-semibold text-white ring-1 ring-white/10"
          whileTap={{ scale: 0.995 }}
          transition={{ duration: 0.25, ease: EASE_APPLE_SOFT }}
          aria-label="Scroll to plan form"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
          Plan a trip
        </motion.button>
      </div>
    </>
  );
}
