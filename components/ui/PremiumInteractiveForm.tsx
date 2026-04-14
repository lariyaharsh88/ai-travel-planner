"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";
import { useCardHoverMotion } from "@/hooks/useCardHoverMotion";

const baseForm =
  "relative overflow-hidden rounded-3xl border border-black/[0.07] bg-white will-change-transform";

/** Same interaction model as cards — calm, paid-product surfaces */
export default function PremiumInteractiveForm({
  children,
  className = "",
  hoverLift = 3,
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
      transition={{ duration: 0.65, ease: EASE_APPLE_SOFT }}
      className={`group ${baseForm} shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-[650ms] [transition-timing-function:cubic-bezier(0.16,1,0.32,1)] hover:border-black/[0.08] hover:shadow-[var(--shadow-card-hover)] ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-[650ms] ease-[cubic-bezier(0.16,1,0.32,1)] group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(15,23,42,0.03), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 40%)",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.form>
  );
}
