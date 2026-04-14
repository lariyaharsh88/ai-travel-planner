"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Camera, Clapperboard, PenLine } from "lucide-react";
import { EASE_APPLE_SOFT, fadeInItem, staggerFast } from "@/lib/motion-premium";

const items = [
  { label: "Reels & scripts", icon: Clapperboard },
  { label: "Photo spots", icon: Camera },
  { label: "Blog draft", icon: PenLine },
] as const;

export default function CreatorHookStrip() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      id="creator-toolkit"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-36px" }}
      transition={{ duration: 0.76, ease: EASE_APPLE_SOFT }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#14120f] p-7 shadow-[0_24px_64px_-32px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04] sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#c2410c]/18 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative">
        <p className="type-eyebrow text-stone-500">For creators</p>
        <h2 className="type-display mt-4 text-[1.25rem] text-white sm:text-[1.375rem]">
          Trip plan + content kit
        </h2>
        <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-stone-400">
          Routes plus shoot-ready notes — one generation.
        </p>

        {reduce ? (
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Creator deliverables">
            {items.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-white/90 backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-stone-500" strokeWidth={1.75} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        ) : (
          <motion.ul
            className="mt-7 flex flex-wrap gap-2"
            aria-label="Creator deliverables"
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
          >
            {items.map(({ label, icon: Icon }) => (
              <motion.li
                key={label}
                variants={fadeInItem}
                whileHover={{ y: -2, transition: { duration: 0.35, ease: EASE_APPLE_SOFT } }}
                className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-white/90 backdrop-blur-sm transition-shadow duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-stone-500" strokeWidth={1.75} aria-hidden />
                {label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}
