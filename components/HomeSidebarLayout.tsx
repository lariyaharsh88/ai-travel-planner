"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";
import { fadeSlideUp, staggerPage } from "@/lib/motion-premium";

type HomeSidebarLayoutProps = {
  children: ReactNode;
};

/** Stacked sidebar blocks — staggered fade + slide (home only) */
export default function HomeSidebarLayout({ children }: HomeSidebarLayoutProps) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  if (reduce) {
    return <div className="flex min-h-0 flex-col gap-[var(--space-block)]">{children}</div>;
  }

  return (
    <motion.div
      className="flex min-h-0 flex-col gap-[var(--space-block)]"
      variants={staggerPage}
      initial="hidden"
      animate="visible"
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={fadeSlideUp} className="min-w-0">
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
