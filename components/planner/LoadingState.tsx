"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

const STEP_MS = 3000;
const STEP_COUNT = 4;

type LoadingStep = {
  id: string;
  line: (destinationLabel: string) => string;
};

const STEPS: LoadingStep[] = [
  {
    id: "plan",
    line: (d) =>
      d ? `Planning your dream trip to ${d}…` : "Planning your dream trip…",
  },
  { id: "gems", line: () => "Finding hidden gems and local angles…" },
  { id: "budget", line: () => "Optimizing your budget and day-wise spend…" },
  { id: "itinerary", line: () => "Locking routes, times, and distances…" },
];

type LoadingStateProps = {
  destination?: string;
};

export default function LoadingState({ destination = "" }: LoadingStateProps) {
  const reduce = useReducedMotion();
  const label = useMemo(() => destination.trim(), [destination]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEP_COUNT - 1));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  const progress = ((stepIndex + 1) / STEP_COUNT) * 100;
  const activeLine = STEPS[stepIndex].line(label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.4, ease: EASE_APPLE_SOFT } }}
      transition={{ duration: 0.55, ease: EASE_APPLE_SOFT }}
      className="relative overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-gradient-to-b from-white to-stone-50/90 px-8 py-12 shadow-[0_24px_64px_-32px_rgba(15,23,42,0.14)] sm:px-12 sm:py-14"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">
        {activeLine} Step {stepIndex + 1} of {STEP_COUNT}.
      </p>

      {/* Ambient accents */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251, 146, 60, 0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139, 92, 246, 0.08), transparent 50%)",
        }}
      />
      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-200/25 blur-3xl"
          aria-hidden
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
        <p className="type-eyebrow text-[#c2410c]/85">Almost there</p>

        <div className="mt-8 min-h-[4.5rem] w-full sm:min-h-[5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={STEPS[stepIndex].id}
              initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: EASE_APPLE_SOFT }}
              className="px-1"
            >
              <p className="font-sans text-[1.1875rem] font-light leading-snug tracking-tight text-stone-900 sm:text-[1.375rem]">
                {activeLine}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div className="mt-10 w-full max-w-sm space-y-3">
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400">
            <span>Progress</span>
            <span className="tabular-nums text-stone-500">
              {stepIndex + 1} / {STEP_COUNT}
            </span>
          </div>
          <div className="relative h-[3px] overflow-hidden rounded-full bg-stone-200/90 ring-1 ring-stone-200/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#c2410c] via-[#FF6B35] to-amber-400"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={
                reduce
                  ? { duration: 0.35 }
                  : { type: "spring", stiffness: 68, damping: 22, mass: 0.85 }
              }
            />
            {!reduce ? (
              <motion.div
                className="pointer-events-none absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-transparent via-white/55 to-transparent"
                aria-hidden
                animate={{ x: ["-20%", "280%"] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            ) : null}
          </div>
        </div>

        {/* Step dots */}
        <div className="mt-8 flex justify-center gap-2">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <motion.span
                key={s.id}
                className={`h-1.5 rounded-full ${
                  done
                    ? "w-6 bg-gradient-to-r from-emerald-500 to-emerald-600"
                    : current
                      ? "w-8 bg-gradient-to-r from-[#c2410c] to-[#FF6B35]"
                      : "w-1.5 bg-stone-300"
                }`}
                initial={false}
                animate={
                  current && !reduce
                    ? { opacity: [0.85, 1, 0.85], scaleY: [1, 1.15, 1] }
                    : { opacity: done ? 1 : 0.4 }
                }
                transition={
                  current && !reduce
                    ? { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                    : { duration: 0.35 }
                }
              />
            );
          })}
        </div>

        <p className="mt-10 max-w-xs text-xs leading-relaxed text-stone-500">
          Crafting routes, costs, and moments you&apos;ll actually use on the ground.
        </p>
      </div>
    </motion.div>
  );
}
