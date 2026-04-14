"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type PageEnterProps = {
  children: ReactNode;
  className?: string;
};

/** Fade + slide entry */
export default function PageEnter({ children, className = "" }: PageEnterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: EASE_APPLE_SOFT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
