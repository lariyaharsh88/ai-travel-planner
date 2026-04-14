"use client";

import { useReducedMotion } from "framer-motion";
import { EASE_APPLE_SOFT, springTap } from "@/lib/motion-premium";

/** Subtle lift — luxury surfaces stay calm */
export function useCardHoverMotion(lift = 2) {
  const reduce = useReducedMotion();
  if (reduce) {
    return { whileHover: undefined, whileTap: undefined };
  }
  return {
    whileHover: {
      y: -lift,
      transition: { duration: 0.58, ease: EASE_APPLE_SOFT },
    },
    whileTap: { scale: 0.997, transition: springTap },
  };
}
