"use client";

import { useReducedMotion } from "framer-motion";
import { EASE_APPLE, springTap } from "@/lib/motion-premium";

export function useCardHoverMotion(lift = 6) {
  const reduce = useReducedMotion();
  if (reduce) {
    return { whileHover: undefined, whileTap: undefined };
  }
  return {
    whileHover: {
      y: -lift,
      transition: { duration: 0.52, ease: EASE_APPLE },
    },
    whileTap: { scale: 0.997, transition: springTap },
  };
}
