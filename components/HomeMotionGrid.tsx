"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  homeColumnLeft,
  homeColumnRight,
  homeGridContainer,
} from "@/lib/page-variants";

type HomeMotionGridProps = {
  hero: ReactNode;
  sidebar: ReactNode;
};

export default function HomeMotionGrid({ hero, sidebar }: HomeMotionGridProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-14">
        <div className="flex min-h-0 flex-col self-stretch lg:col-span-5">{hero}</div>
        <div className="min-h-0 lg:col-span-7">{sidebar}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-14"
      variants={homeGridContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex min-h-0 flex-col self-stretch lg:col-span-5"
        variants={homeColumnLeft}
      >
        {hero}
      </motion.div>
      <motion.div className="min-h-0 lg:col-span-7" variants={homeColumnRight}>
        {sidebar}
      </motion.div>
    </motion.div>
  );
}
