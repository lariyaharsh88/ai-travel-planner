"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

/** Eyebrow → display → body — clear hierarchy + optional motion */
export default function SectionHeader({ eyebrow, title, subtitle, className = "" }: SectionHeaderProps) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-36px" }}
      transition={{ duration: 0.68, ease: EASE_APPLE_SOFT }}
      className={`mb-9 max-w-2xl sm:mb-11 ${className}`}
    >
      <p className="type-eyebrow">{eyebrow}</p>
      <div className="mt-3 h-px w-8 rounded-full bg-gradient-to-r from-[#c2410c]/55 to-transparent" aria-hidden />
      <h3 className="type-display mt-4">{title}</h3>
      {subtitle ? <p className="type-body-muted mt-3 max-w-[42ch]">{subtitle}</p> : null}
    </motion.header>
  );
}
