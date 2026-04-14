"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import SectionHeader from "@/components/planner/SectionHeader";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type CreatorModeSectionProps = {
  destination: string;
  spotsBlock: ReactNode;
  anglesBlock: ReactNode;
};

/** Photo spots + angles — one chapter, minimal chrome */
export default function CreatorModeSection({
  destination,
  spotsBlock,
  anglesBlock,
}: CreatorModeSectionProps) {
  const dest = destination.trim() || "India";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.68, ease: EASE_APPLE_SOFT }}
      className="space-y-12 md:space-y-16"
    >
      <SectionHeader
        eyebrow="Creator mode"
        title="Photo spots & angles"
        subtitle={`Feed-ready frames for ${dest} — tied to your route.`}
      />
      <div className="space-y-12 md:space-y-16">
        {spotsBlock}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-200/80 to-transparent" aria-hidden />
        {anglesBlock}
      </div>
    </motion.div>
  );
}
