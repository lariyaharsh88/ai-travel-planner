"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import UnlockPremiumButton from "@/components/planner/UnlockPremiumButton";
import { EASE_APPLE } from "@/lib/motion-premium";

type PaywallModalProps = {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  isPaying: boolean;
};

const FEATURES = [
  { title: "Full itinerary", detail: "Every day, stop, and leg — not just the preview" },
  { title: "Hidden gems", detail: "Off-path picks marked in your route" },
  { title: "Creator Mode", detail: "Reels, IG spots, angles & light when you chose Creator" },
  { title: "Budget breakdown", detail: "Stay, food & transport in clear INR lines" },
  { title: "PDF download", detail: "Print-ready doc with cover & summary" },
] as const;

export default function PaywallModal({ open, onClose, onUnlock, isPaying }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="upgrade-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_APPLE }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="paywall-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-8 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.28)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_APPLE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-300 via-[#FF6B35] to-violet-400"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">EpicIndiaTrips AI Planner</p>
            <h3 id="paywall-title" className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
              Unlock Premium Travel Plan
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              You&apos;ve hit the limit for today&apos;s free preview — or you want the full experience. One payment
              unlocks everything below for your account.
            </p>

            <ul className="mt-6 space-y-3 rounded-2xl border border-stone-200/80 bg-[#fafaf9] px-4 py-4">
              {FEATURES.map((item) => (
                <li key={item.title} className="flex gap-3 text-sm text-stone-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c2410c]" strokeWidth={2.25} aria-hidden />
                  <span>
                    <span className="font-semibold text-stone-900">{item.title}</span>
                    <span className="text-stone-500"> — {item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                Maybe later
              </button>
              <div className="flex w-full justify-center sm:justify-end">
                <UnlockPremiumButton
                  onClick={onUnlock}
                  disabled={isPaying}
                  className={isPaying ? "pointer-events-none opacity-60" : ""}
                >
                  {isPaying ? "Opening secure checkout…" : "Unlock Premium Travel Plan"}
                </UnlockPremiumButton>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-stone-400">
              <span className="font-semibold text-stone-600">₹99</span> one-time · Razorpay · instant access after payment
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
