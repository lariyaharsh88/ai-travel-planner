"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
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
        className="fixed bottom-6 right-5 z-40 hidden items-center gap-2 rounded-full bg-[#14120f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)] ring-1 ring-white/10 sm:flex"
        whileHover={{
          scale: 1.04,
          boxShadow: "0 16px 48px -12px rgba(15, 23, 42, 0.35)",
          transition: { duration: 0.45, ease: EASE_APPLE },
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE_APPLE }}
        aria-label="Scroll to plan form"
      >
        <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.35, ease: EASE_APPLE }}>
          <ArrowUp className="h-4 w-4" aria-hidden />
        </motion.span>
        Plan a trip
      </motion.button>
      <motion.button
        type="button"
        onClick={onClick}
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 bg-[#14120f] px-5 py-4 text-sm font-semibold text-white shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-white/10 sm:hidden"
        whileTap={{ scale: 0.99 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.35, ease: EASE_APPLE }}
        aria-label="Scroll to plan form"
      >
        <ArrowUp className="h-4 w-4" aria-hidden />
        Plan a trip
      </motion.button>
    </>
  );
}
