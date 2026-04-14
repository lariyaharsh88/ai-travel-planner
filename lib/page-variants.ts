import type { Variants } from "framer-motion";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

/** Orchestrates column children on the home grid */
export const homeGridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
      when: "beforeChildren",
    },
  },
};

export const homeColumnLeft: Variants = {
  hidden: { opacity: 0, x: -12, y: 6 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.75, ease: EASE_APPLE_SOFT },
  },
};

export const homeColumnRight: Variants = {
  hidden: { opacity: 0, x: 12, y: 6 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.75, ease: EASE_APPLE_SOFT },
  },
};

