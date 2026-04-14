"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { EASE_APPLE } from "@/lib/motion-premium";

type PaywallModalProps = {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  isPaying: boolean;
};

const FEATURES = [
  { title: "Hidden gems", detail: "Lesser-known stops and local picks woven into your route" },
  { title: "Creator mode", detail: "Reel scripts, Instagram spots, and photo angles tied to real places" },
  { title: "PDF export", detail: "Print-ready itinerary with cover and budget summary" },
  { title: "Full budget breakdown", detail: "Day-wise feel plus stay, food, and transport snapshot" },
] as const;

export default function PaywallModal({ open, onClose, onUnlock, isPaying }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="upgrade-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-md"
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
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-200 via-[#FF6B35] to-amber-200"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">EpicIndiaTrips AI Planner</p>
            <h3 id="paywall-title" className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
              Unlock Premium Plan
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              You&apos;ve used today&apos;s complimentary generation. Get the full experience — the same briefing flow,
              with everything below included.
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={onUnlock}
                disabled={isPaying}
                className="w-full rounded-2xl bg-[#14120f] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(15,23,42,0.35)] transition hover:bg-[#1c1917] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying ? "Opening secure checkout…" : "Unlock Premium Plan"}
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-stone-400">
              One-time unlock · secure checkout
              <span className="text-stone-300"> · </span>
              <span className="font-semibold text-stone-600">₹99</span>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
