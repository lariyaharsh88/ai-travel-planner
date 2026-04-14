"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";
import { useCardHoverMotion } from "@/hooks/useCardHoverMotion";

const baseForm =
  "relative overflow-hidden rounded-[1.35rem] border border-stone-200/60 bg-white/[0.98] backdrop-blur-[3px] will-change-transform";

/** Same interaction model as `PremiumInteractiveCard`, for `<form>` semantics. */
export default function PremiumInteractiveForm({
  children,
  className = "",
  hoverLift = 5,
  ...rest
}: Omit<HTMLMotionProps<"form">, "children"> & {
  children: ReactNode;
  hoverLift?: number;
}) {
  const { whileHover, whileTap } = useCardHoverMotion(hoverLift);

  return (
    <motion.form
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.55, ease: EASE_APPLE }}
      className={`group ${baseForm} shadow-[0_4px_6px_-1px_rgba(15,23,42,0.06),0_18px_48px_-20px_rgba(15,23,42,0.14)] transition-[box-shadow,border-color] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-stone-200/95 hover:shadow-[0_36px_80px_-28px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,107,53,0.08),0_0_40px_-12px_rgba(255,107,53,0.1)] ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.35rem] opacity-0 transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(130% 90% at 50% -15%, rgba(255,107,53,0.1), transparent 50%), linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 35%)",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.form>
  );
}
