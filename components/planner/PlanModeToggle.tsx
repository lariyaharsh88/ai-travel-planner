"use client";

import { motion } from "framer-motion";
import { Clapperboard, Map } from "lucide-react";
import { EASE_APPLE_SOFT, springGentle } from "@/lib/motion-premium";
import { type PlanMode } from "@/lib/plan-mode";

type PlanModeToggleProps = {
  value: PlanMode;
  onChange: (mode: PlanMode) => void;
  disabled?: boolean;
  id?: string;
};

/**
 * Normal Plan vs Creator Plan — core product differentiator control.
 */
export default function PlanModeToggle({
  value,
  onChange,
  disabled = false,
  id = "plan-mode-toggle",
}: PlanModeToggleProps) {
  const creatorOn = value === "creator";

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p id={`${id}-label`} className="type-eyebrow">
            Plan mode
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-600">
            <span className="font-medium text-stone-800">Trip</span> prioritises route and map.{" "}
            <span className="font-medium text-stone-800">Creator</span> layers reels, shots, and light.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <span
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
              !creatorOn ? "text-stone-900" : "text-stone-400"
            }`}
          >
            <Map className="h-3.5 w-3.5" aria-hidden />
            Normal
          </span>

          <button
            type="button"
            id={id}
            role="switch"
            aria-checked={creatorOn}
            aria-labelledby={`${id}-label`}
            disabled={disabled}
            onClick={() => onChange(creatorOn ? "standard" : "creator")}
            className="relative h-11 w-[4.25rem] shrink-0 rounded-full border border-stone-200/90 bg-stone-100/90 shadow-inner transition-[background,border-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]/45 disabled:cursor-not-allowed disabled:opacity-50 data-[on=true]:border-[#c2410c]/20 data-[on=true]:bg-gradient-to-r data-[on=true]:from-amber-50/95 data-[on=true]:to-orange-50/80 data-[on=true]:shadow-[0_6px_28px_-14px_rgba(194,65,12,0.28)]"
            data-on={creatorOn}
          >
            <motion.span
              initial={false}
              animate={{ x: creatorOn ? 30 : 0 }}
              transition={springGentle}
              className={`absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full shadow-md ring-1 ring-black/[0.05] ${
                creatorOn
                  ? "bg-gradient-to-br from-[#c2410c] to-[#ea580c] text-white"
                  : "bg-white text-stone-600"
              }`}
            >
              {creatorOn ? (
                <Clapperboard className="h-4 w-4" strokeWidth={1.85} aria-hidden />
              ) : (
                <Map className="h-4 w-4" strokeWidth={1.85} aria-hidden />
              )}
            </motion.span>
          </button>

          <span
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
              creatorOn ? "text-stone-900" : "text-stone-400"
            }`}
          >
            <Clapperboard className="h-3.5 w-3.5" aria-hidden />
            Creator
          </span>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_APPLE_SOFT }}
        className={`rounded-2xl border px-4 py-3 text-[13px] leading-relaxed transition-colors duration-300 ${
          creatorOn
            ? "border-[#c2410c]/18 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 text-stone-800"
            : "border-stone-200/70 bg-stone-50/40 text-stone-600"
        }`}
      >
        {creatorOn ? (
          <>
            <span className="font-semibold text-[#9a3412]">Creator — </span>
            Spots, reels, angles, and golden-hour timing in your export.
          </>
        ) : (
          <>
            <span className="font-semibold text-stone-800">Trip — </span>
            Route, map, and budget first. Switch before you generate.
          </>
        )}
      </motion.div>
    </div>
  );
}
