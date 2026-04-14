"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

type UnlockPremiumButtonProps = {
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
  disabled?: boolean;
};

/**
 * Primary conversion CTA — subtle idle animation for attention without noise.
 */
export default function UnlockPremiumButton({
  onClick,
  className = "",
  size = "default",
  children = "Unlock Premium Travel Plan",
  disabled = false,
}: UnlockPremiumButtonProps) {
  const sizeClass =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : size === "lg"
        ? "px-8 py-4 text-[0.9375rem]"
        : "px-6 py-3 text-sm";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl font-semibold text-white shadow-[0_12px_36px_-14px_rgba(194,65,12,0.55)] ring-1 ring-white/25 disabled:cursor-not-allowed disabled:opacity-55 ${sizeClass} ${className}`}
      whileHover={
        disabled ? undefined : { scale: 1.03, transition: { duration: 0.35, ease: EASE_APPLE_SOFT } }
      }
      whileTap={disabled ? undefined : { scale: 0.98 }}
      animate={
        disabled
          ? undefined
          : {
              boxShadow: [
                "0 12px 36px -14px rgba(194, 65, 12, 0.45)",
                "0 16px 44px -12px rgba(194, 65, 12, 0.62)",
                "0 12px 36px -14px rgba(194, 65, 12, 0.45)",
              ],
            }
      }
      transition={
        disabled
          ? undefined
          : { boxShadow: { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }
      }
    >
      <span
        className="absolute inset-0 bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#FF6B35]"
        aria-hidden
      />
      <motion.span
        className="absolute inset-0 opacity-40"
        aria-hidden
        animate={{ x: ["-30%", "130%"] }}
        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 45%, transparent 70%)",
        }}
      />
      <span className="relative z-[1] flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 opacity-95" strokeWidth={1.85} aria-hidden />
        {children}
      </span>
    </motion.button>
  );
}
