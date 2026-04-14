"use client";

import { motion } from "framer-motion";
import { Camera, Clapperboard, PenLine } from "lucide-react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

const items = [
  { label: "Reels & scripts", icon: Clapperboard },
  { label: "Photo spots", icon: Camera },
  { label: "Blog draft", icon: PenLine },
] as const;

export default function CreatorHookStrip() {
  return (
    <motion.div
      id="creator-toolkit"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE_APPLE_SOFT }}
      className="relative overflow-hidden rounded-[1.75rem] border border-stone-800/90 bg-[#14120f] p-8 shadow-[0_24px_64px_-32px_rgba(0,0,0,0.5)] sm:p-9"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c2410c]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <p className="type-eyebrow text-stone-500">For creators</p>
        <h2 className="type-display mt-4 text-[1.25rem] text-white sm:text-[1.375rem]">
          Trip plan + content kit
        </h2>
        <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-stone-400">
          Same run delivers routes and shoot-ready notes — not a generic wall of text.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Creator deliverables">
          {items.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-white/90"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-stone-500" strokeWidth={1.75} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
