"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useCallback, useState } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";
import { toast } from "sonner";
import FloatingCta from "@/components/planner/FloatingCta";
import InputForm, { type InputFormData } from "@/components/planner/InputForm";
import LoadingState from "@/components/planner/LoadingState";
import PlanOutput from "@/components/planner/PlanOutput";
import { TravelPlanResponse } from "@/lib/travel-plan";

type UsageState = {
  date: string;
  freeUsed: number;
  paidCredits: number;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  theme?: {
    color?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const USAGE_STORAGE_KEY = "ai-travel-planner-usage";
const DAILY_FREE_LIMIT = 1;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsageState(): UsageState {
  if (typeof window === "undefined") {
    return { date: getTodayKey(), freeUsed: 0, paidCredits: 0 };
  }

  try {
    const raw = window.localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), freeUsed: 0, paidCredits: 0 };

    const parsed = JSON.parse(raw) as Partial<UsageState>;
    const today = getTodayKey();
    if (parsed.date !== today) {
      const resetState = {
        date: today,
        freeUsed: 0,
        paidCredits: parsed.paidCredits ?? 0,
      };
      window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(resetState));
      return resetState;
    }

    return {
      date: parsed.date ?? today,
      freeUsed: parsed.freeUsed ?? 0,
      paidCredits: parsed.paidCredits ?? 0,
    };
  } catch {
    return { date: getTodayKey(), freeUsed: 0, paidCredits: 0 };
  }
}

function saveUsageState(nextState: UsageState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(nextState));
}

function canGenerate(state: UsageState) {
  return state.freeUsed < DAILY_FREE_LIMIT || state.paidCredits > 0;
}

export default function PlannerShell() {
  const [formData, setFormData] = useState<InputFormData>({
    destination: "",
    budget: 0,
    days: 1,
    travelStyle: "budget",
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlanResponse | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const scrollToForm = useCallback(() => {
    document.getElementById("planner-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const usageState = getUsageState();
    if (!canGenerate(usageState)) {
      setShowUpgradeModal(true);
      toast.message("Daily free limit reached", {
        description: "Unlock another plan to keep exploring.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: formData.destination,
          budget: formData.budget,
          days: formData.days,
          style: formData.travelStyle,
          interests: formData.interests,
        }),
      });

      const data = (await response.json()) as TravelPlanResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate plan");
      }

      const refreshedUsageState = getUsageState();
      const nextUsageState =
        refreshedUsageState.freeUsed < DAILY_FREE_LIMIT
          ? { ...refreshedUsageState, freeUsed: refreshedUsageState.freeUsed + 1 }
          : { ...refreshedUsageState, paidCredits: Math.max(refreshedUsageState.paidCredits - 1, 0) };
      saveUsageState(nextUsageState);

      setGeneratedPlan(data);
      toast.success("Your trip is ready", {
        description: "Scroll to explore your itinerary and map.",
      });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating the plan.";
      setError(message);
      setGeneratedPlan(null);
      toast.error("Couldn’t generate plan", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = async () => {
    if (window.Razorpay) return true;

    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!razorpayKey) {
      setError("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID in environment variables.");
      toast.error("Payment unavailable", {
        description: "Razorpay key is not configured.",
      });
      return;
    }

    setIsPaying(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setIsPaying(false);
      setError("Failed to load Razorpay. Please try again.");
      toast.error("Payment failed to load");
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: 9900,
      currency: "INR",
      name: "EpicIndiaTrips AI Planner",
      description: "Unlock 1 additional travel plan",
      handler: () => {
        const currentUsage = getUsageState();
        const nextUsage = { ...currentUsage, paidCredits: currentUsage.paidCredits + 1 };
        saveUsageState(nextUsage);
        setShowUpgradeModal(false);
        setError(null);
        setIsPaying(false);
        toast.success("Unlocked", { description: "You can generate another plan." });
      },
      theme: {
        color: "#FF6B35",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setIsPaying(false);
  };

  return (
    <div className="space-y-4 pb-28 sm:pb-10">
      <InputForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingState key="loading" />
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {generatedPlan && !isLoading ? (
          <motion.div
            key="plan-output"
            layout
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE_APPLE }}
            className="pt-2"
          >
            <PlanOutput result={generatedPlan} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FloatingCta onClick={scrollToForm} />

      <AnimatePresence>
        {showUpgradeModal ? (
          <motion.div
            key="upgrade-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_APPLE }}
            onClick={() => setShowUpgradeModal(false)}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="upgrade-title"
              className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/20 bg-white p-8 shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE_APPLE }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#ff8f66] to-[#ffb347]"
                aria-hidden
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">Premium</p>
              <h3 id="upgrade-title" className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                Daily free limit reached
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Unlock another AI-generated plan whenever inspiration strikes.
              </p>
              <p className="mt-2 text-lg font-semibold text-stone-900">₹99 per plan</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
                >
                  Maybe later
                </button>
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={isPaying}
                  className="w-full rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPaying ? "Opening…" : "Pay with Razorpay"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
