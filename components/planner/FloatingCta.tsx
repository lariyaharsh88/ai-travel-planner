"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EASE_APPLE } from "@/lib/motion-premium";

type FloatingCtaProps = {
  onClick: () => void;
};

export default function FloatingCta({ onClick }: FloatingCtaProps) {
  return (
    <>
      <motion.button
        type="button"
        onClick={onClick}
        className="fixed bottom-6 right-5 z-40 hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] via-[#ff8f66] to-[#ffb347] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_44px_-10px_rgba(255,107,53,0.55)] ring-1 ring-white/25 sm:flex"
        whileHover={{
          scale: 1.06,
          boxShadow: "0 20px 56px -12px rgba(255, 107, 53, 0.45)",
          transition: { duration: 0.45, ease: EASE_APPLE },
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE_APPLE }}
        aria-label="Scroll to plan form"
      >
        <motion.span whileHover={{ rotate: 18, scale: 1.08 }} transition={{ duration: 0.45, ease: EASE_APPLE }}>
          <Sparkles className="h-4 w-4" aria-hidden />
        </motion.span>
        Generate Plan
      </motion.button>
      <motion.button
        type="button"
        onClick={onClick}
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B35] via-[#ff8f66] to-[#ffb347] px-5 py-4 text-sm font-semibold text-white shadow-[0_-8px_32px_-8px_rgba(255,107,53,0.45)] sm:hidden"
        whileTap={{ scale: 0.99 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.35, ease: EASE_APPLE }}
        aria-label="Scroll to plan form"
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        Generate Plan
      </motion.button>
    </>
  );
}
