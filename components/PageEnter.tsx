"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type PageEnterProps = {
  children: ReactNode;
  className?: string;
};

/** Fade + slide entry — respects reduced motion */
export default function PageEnter({ children, className = "" }: PageEnterProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.76, ease: EASE_APPLE_SOFT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
