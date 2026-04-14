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
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.64, ease: EASE_APPLE_SOFT }}
      className={`mb-10 max-w-2xl sm:mb-12 ${className}`}
    >
      <p className="type-eyebrow">{eyebrow}</p>
      <div className="mt-4 h-px w-10 rounded-full bg-gradient-to-r from-[#c2410c]/70 to-stone-300/50" aria-hidden />
      <h3 className="type-display mt-5">{title}</h3>
      {subtitle ? <p className="type-body-muted mt-4 max-w-[44ch]">{subtitle}</p> : null}
    </motion.header>
  );
}
