"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";
import { useCardHoverMotion } from "@/hooks/useCardHoverMotion";

const baseForm =
  "relative overflow-hidden rounded-[1.35rem] border border-stone-200/70 bg-white/[0.97] backdrop-blur-[2px] will-change-transform";

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
      className={`group ${baseForm} shadow-[0_10px_40px_-18px_rgba(15,23,42,0.1)] transition-[box-shadow,border-color] duration-[520ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-stone-200/90 hover:shadow-[0_32px_72px_-22px_rgba(15,23,42,0.15),0_0_0_1px_rgba(255,107,53,0.06)] ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.35rem] opacity-0 transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(125% 85% at 50% -10%, rgba(255,107,53,0.07), transparent 52%)",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.form>
  );
}
