"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Clapperboard,
  Loader2,
  MapPin,
  Route,
  Sparkles,
  Wallet,
} from "lucide-react";
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

/** Ordered steps — index advances forward while loading (no loop reset). */
const PLANNING_STEPS = [
  {
    title: "Planning your route & timing",
    detail: "Realistic time blocks and legs between stops.",
    Icon: Route,
  },
  {
    title: "Finding hidden gems",
    detail: "Offbeat picks and crowd-aware windows.",
    Icon: Sparkles,
  },
  {
    title: "Optimizing your budget",
    detail: "Stay, food, and transport in balance.",
    Icon: Wallet,
  },
  {
    title: "Creator kit",
    detail: "Reel scripts, IG spots, and photo angles.",
    Icon: Clapperboard,
  },
  {
    title: "Final polish",
    detail: "Tightening until it feels trip-ready.",
    Icon: MapPin,
  },
] as const;

const STEP_MS = 2600;

type LoadingStateProps = {
  /** Destination from the form, e.g. "Goa" — powers personalized copy */
  destination?: string;
};

export default function LoadingState({ destination = "" }: LoadingStateProps) {
  const reduce = useReducedMotion();
  const place = useMemo(() => destination.trim(), [destination]);
  const [activeStep, setActiveStep] = useState(0);

  const headline = place
    ? `Planning your dream trip to ${place}…`
    : "Planning your dream trip…";

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStep((i) => Math.min(i + 1, PLANNING_STEPS.length - 1));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  const progress = ((activeStep + 1) / PLANNING_STEPS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
      className="relative overflow-hidden rounded-3xl border border-black/[0.07] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.12)] sm:p-8"
      role="status"
      aria-busy="true"
    >
      <p className="sr-only">
        Generating your personalized travel plan
        {place ? ` for ${place}` : ""}. Step {activeStep + 1} of {PLANNING_STEPS.length}. Please wait.
      </p>

      <div className="pointer-events-none absolute inset-0 animate-shimmer-overlay" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#FF6B35]/12 blur-2xl"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.1, 1],
                opacity: [0.45, 0.7, 0.45],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex max-w-lg flex-col gap-6">
        <div className="text-center">
          <motion.div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#ffb347] text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.45)] ring-2 ring-white/40"
            initial={reduce ? false : { scale: 0.88, rotate: -5 }}
            animate={
              reduce
                ? undefined
                : {
                    scale: 1,
                    rotate: 0,
                    y: [0, -4, 0],
                  }
            }
            transition={{
              scale: { ...springGentle, delay: 0.05 },
              rotate: { ...springGentle, delay: 0.05 },
              y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <MapPin className="relative h-6 w-6" strokeWidth={1.85} aria-hidden />
          </motion.div>

          <h2 className="font-sans text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
            {place ? (
              <>
                Planning your dream trip to{" "}
                <span className="bg-gradient-to-r from-[#c2410c] to-[#FF6B35] bg-clip-text text-transparent">
                  {place}
                </span>
                …
              </>
            ) : (
              headline
            )}
          </h2>
          <p className="mt-2 text-sm text-stone-500">Hang tight — this is worth the wait.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            <span>Steps</span>
            <span className="tabular-nums text-stone-500">
              {activeStep + 1} / {PLANNING_STEPS.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] via-[#ff8f66] to-[#ffb347]"
              initial={{ width: `${100 / PLANNING_STEPS.length}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <ol className="relative space-y-0">
          <div
            className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-[#FF6B35]/50 via-stone-200 to-stone-100 sm:left-[17px]"
            aria-hidden
          />
          {PLANNING_STEPS.map((step, i) => {
            const done = i < activeStep;
            const current = i === activeStep;
            const pending = i > activeStep;
            const Icon = step.Icon;

            return (
              <motion.li
                key={step.title}
                layout
                className="relative flex gap-3 pb-4 last:pb-0 sm:gap-4"
                initial={false}
                animate={{
                  opacity: pending ? 0.45 : 1,
                }}
                transition={{ duration: 0.35, ease: EASE_APPLE }}
              >
                <div className="relative z-[1] flex shrink-0 flex-col items-center pt-0.5">
                  <motion.span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-bold sm:h-9 sm:w-9 ${
                      done
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                        : current
                          ? "border-[#FF6B35] bg-white text-[#FF6B35] shadow-[0_0_0_4px_rgba(255,107,53,0.15)]"
                          : "border-stone-200 bg-white text-stone-300"
                    }`}
                    animate={
                      current && !reduce
                        ? { scale: [1, 1.06, 1], boxShadow: ["0 0 0 4px rgba(255,107,53,0.12)", "0 0 0 6px rgba(255,107,53,0.2)", "0 0 0 4px rgba(255,107,53,0.12)"] }
                        : {}
                    }
                    transition={
                      current && !reduce
                        ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                  >
                    {done ? (
                      <Check className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} aria-hidden />
                    ) : current ? (
                      reduce ? (
                        <span className="block h-2 w-2 rounded-full bg-[#FF6B35]" aria-hidden />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin sm:h-[18px] sm:w-[18px]" aria-hidden />
                      )
                    ) : (
                      <span className="text-[10px] sm:text-xs">{i + 1}</span>
                    )}
                  </motion.span>
                </div>

                <div
                  className={`min-w-0 flex-1 rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 ${
                    current
                      ? "border-[#FF6B35]/35 bg-gradient-to-br from-orange-50/90 to-white shadow-sm"
                      : done
                        ? "border-emerald-100/90 bg-emerald-50/35"
                        : "border-stone-100 bg-stone-50/40"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      className={`mt-0.5 h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px] ${
                        current ? "text-[#c2410c]" : done ? "text-emerald-700" : "text-stone-300"
                      }`}
                      strokeWidth={2}
                      aria-hidden
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          pending ? "text-stone-500" : "text-stone-900"
                        }`}
                      >
                        {step.title}
                      </p>
                      <AnimatePresence mode="wait">
                        {current ? (
                          <motion.p
                            key="detail"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.3, ease: EASE_APPLE }}
                            className="mt-1 text-xs leading-relaxed text-stone-600"
                          >
                            {step.detail}
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <p className="text-center text-[11px] text-stone-400">
          Route · map · budget · hidden gems · creator spots
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
