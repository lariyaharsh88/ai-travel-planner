"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_APPLE } from "@/lib/motion-premium";

const skeleton = "animate-pulse rounded-2xl bg-stone-200/80";

const skeletonStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const skeletonItem = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function LoadingState() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{ duration: 0.45, ease: EASE_APPLE }}
      className="relative overflow-hidden rounded-[1.35rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-28px_rgba(28,25,23,0.14)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0 animate-shimmer-overlay" aria-hidden />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-1 text-sm font-medium text-stone-700">
          <span>Crafting your trip</span>
          {!reduce ? (
            <span className="inline-flex gap-0.5 pt-0.5">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1 w-1 rounded-full bg-[#FF6B35]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </span>
          ) : (
            <span className="text-stone-400" aria-hidden>
              …
            </span>
          )}
        </div>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-stone-100">
          {!reduce ? (
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#ffb347]"
              initial={{ width: "12%" }}
              animate={{ width: ["12%", "88%", "45%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <div className="h-full w-2/3 rounded-full bg-[#FF6B35]/40" />
          )}
        </div>
        <p className="text-xs text-stone-500">Mapping routes, budgets, and reel hooks…</p>
      </div>

      {reduce ? (
        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${skeleton} h-24`} />
          ))}
        </div>
      ) : (
        <motion.div
          className="relative mt-8 grid gap-3 sm:grid-cols-3"
          variants={skeletonStagger}
          initial="hidden"
          animate="visible"
        >
          {[0, 1, 2].map((i) => (
            <motion.div key={i} variants={skeletonItem} className={`${skeleton} h-24`} />
          ))}
        </motion.div>
      )}
      <div className="relative mt-4 space-y-3">
        <div className={`${skeleton} h-4 w-2/3`} />
        <div className={`${skeleton} h-3 w-full`} />
        <div className={`${skeleton} h-3 w-5/6`} />
      </div>
    </motion.div>
  );
}
