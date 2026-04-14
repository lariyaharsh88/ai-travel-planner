"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";
import { useCardHoverMotion } from "@/hooks/useCardHoverMotion";

const baseCard =
  "relative overflow-hidden rounded-3xl border border-black/[0.07] bg-white will-change-transform";

/** Restrained elevation — product polish over flashy gradients */
export default function PremiumInteractiveCard({
  children,
  className = "",
  hoverLift = 4,
  ...rest
}: Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  hoverLift?: number;
}) {
  const { whileHover, whileTap } = useCardHoverMotion(hoverLift);

  return (
    <motion.div
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.65, ease: EASE_APPLE_SOFT }}
      className={`group ${baseCard} shadow-[var(--shadow-card)] transition-[box-shadow,border-color,transform] duration-[650ms] [transition-timing-function:cubic-bezier(0.16,1,0.32,1)] hover:border-black/[0.08] hover:shadow-[var(--shadow-card-hover)] ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-[650ms] ease-[cubic-bezier(0.16,1,0.32,1)] group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(15,23,42,0.03), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.65) 0%, transparent 42%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-80" />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
