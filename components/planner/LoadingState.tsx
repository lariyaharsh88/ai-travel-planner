"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";

const skeleton = "animate-pulse rounded-2xl bg-stone-200/80";

const skeletonStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const skeletonItem = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const STATUS_LINES = [
  "Mapping routes and travel times…",
  "Weaving in hidden gems & local tips…",
  "Drafting reel scripts & photo angles…",
  "Balancing your budget breakdown…",
  "Almost there — polishing your itinerary…",
];

type LoadingStateProps = {
  /** Destination from the form, e.g. "Manali" — powers personalized copy */
  destination?: string;
};

export default function LoadingState({ destination = "" }: LoadingStateProps) {
  const reduce = useReducedMotion();
  const place = useMemo(() => destination.trim(), [destination]);
  const [lineIndex, setLineIndex] = useState(0);

  const headline = place
    ? `Planning your dream trip to ${place}…`
    : "Planning your dream trip…";

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % STATUS_LINES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="relative overflow-hidden rounded-[1.35rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-28px_rgba(28,25,23,0.14)]"
      role="status"
      aria-busy="true"
    >
      <p className="sr-only">
        Generating your personalized travel plan
        {place ? ` for ${place}` : ""}. Please wait.
      </p>

      <div className="pointer-events-none absolute inset-0 animate-shimmer-overlay" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FF6B35]/10 blur-2xl"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.75, 0.5],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#ffb347] text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.45)] ring-2 ring-white/40"
          initial={reduce ? false : { scale: 0.85, rotate: -6 }}
          animate={
            reduce
              ? undefined
              : {
                  scale: 1,
                  rotate: 0,
                  y: [0, -3, 0],
                }
          }
          transition={{
            scale: { ...springGentle, delay: 0.05 },
            rotate: { ...springGentle, delay: 0.05 },
            y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {!reduce ? (
            <motion.span
              className="absolute inset-0 rounded-2xl bg-white/20"
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <MapPin className="relative h-6 w-6" strokeWidth={1.85} aria-hidden />
          <motion.span
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#FF6B35] shadow-md"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springGentle, delay: 0.2 }}
            aria-hidden
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.span>
        </motion.div>

        <div className="space-y-1.5 px-1">
          <p className="text-lg font-semibold tracking-tight text-stone-900">{headline}</p>
          <div className="min-h-[2.75rem] sm:min-h-[2.5rem]" aria-hidden>
            {reduce ? (
              <p className="text-sm text-stone-600">{STATUS_LINES[0]}</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE_APPLE }}
                  className="text-sm text-stone-600"
                >
                  {STATUS_LINES[lineIndex]}
                </motion.p>
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="flex w-full max-w-sm items-center gap-1.5 pt-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Progress</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200/60">
            {!reduce ? (
              <motion.div
                className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#FF6B35] via-[#ff8f66] to-[#ffb347]"
                initial={{ width: "8%" }}
                animate={{ width: ["8%", "92%", "40%", "100%", "12%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ) : (
              <div className="h-full w-3/4 rounded-full bg-[#FF6B35]/50" />
            )}
          </div>
        </div>

        <p className="text-xs text-stone-500">
          Routes · budget · hidden gems · reels · Instagram spots · photo angles
        </p>
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
            <motion.div
              key={i}
              variants={skeletonItem}
              whileHover={{ y: -2, transition: springGentle }}
              className={`${skeleton} h-24 shadow-sm`}
            />
          ))}
        </motion.div>
      )}
      <motion.div
        className="relative mt-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <motion.div
          className={`${skeleton} h-4 w-2/3`}
          animate={reduce ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className={`${skeleton} h-3 w-full`} />
        <div className={`${skeleton} h-3 w-5/6`} />
      </motion.div>
    </motion.div>
  );
}
