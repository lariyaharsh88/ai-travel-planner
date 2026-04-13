import type { Variants } from "framer-motion";
import { EASE_APPLE } from "@/lib/motion-premium";

/** Orchestrates column children on the home grid */
export const homeGridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

export const homeColumnLeft: Variants = {
  hidden: { opacity: 0, x: -20, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.62, ease: EASE_APPLE },
  },
};

export const homeColumnRight: Variants = {
  hidden: { opacity: 0, x: 20, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.62, ease: EASE_APPLE },
  },
};

