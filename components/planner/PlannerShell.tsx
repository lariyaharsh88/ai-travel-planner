"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useCallback, useState } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";
import { toast } from "sonner";
import FloatingCta from "@/components/planner/FloatingCta";
import InputForm, { type InputFormData } from "@/components/planner/InputForm";
import LoadingState from "@/components/planner/LoadingState";
import PaywallModal from "@/components/planner/PaywallModal";
import PlanOutput from "@/components/planner/PlanOutput";
import { type GenerationTier } from "@/lib/generation-tier";
import { DEFAULT_PLAN_MODE, type PlanMode } from "@/lib/plan-mode";
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
    planMode: DEFAULT_PLAN_MODE,
  });
  const [lastPlanMode, setLastPlanMode] = useState<PlanMode>(DEFAULT_PLAN_MODE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlanResponse | null>(null);
  const [generationTier, setGenerationTier] = useState<GenerationTier>("premium");
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
      toast.message("Unlock Premium Travel Plan", {
        description: "Hidden gems, creator spots, PDF & budget breakdown — when you’re ready to go beyond the free daily plan.",
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
          planMode: formData.planMode,
        }),
      });

      const data = (await response.json()) as TravelPlanResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate plan");
      }

      const before = getUsageState();
      const tier: GenerationTier = before.freeUsed < DAILY_FREE_LIMIT ? "free" : "premium";
      const nextUsageState =
        before.freeUsed < DAILY_FREE_LIMIT
          ? { ...before, freeUsed: before.freeUsed + 1 }
          : { ...before, paidCredits: Math.max(before.paidCredits - 1, 0) };
      saveUsageState(nextUsageState);

      setLastPlanMode(formData.planMode);
      setGenerationTier(tier);
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
      name: "Unlock Premium Travel Plan",
      description: "Hidden gems · Creator spots · PDF · Budget breakdown",
      handler: () => {
        const currentUsage = getUsageState();
        const nextUsage = { ...currentUsage, paidCredits: currentUsage.paidCredits + 1 };
        saveUsageState(nextUsage);
        setShowUpgradeModal(false);
        setError(null);
        setIsPaying(false);
        toast.success("Unlock Premium Travel Plan", {
          description: "You’re in — hidden gems, creator spots, PDF & budget breakdown on your next generations.",
        });
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
    <div className="space-y-8 pb-28 sm:space-y-10 sm:pb-12">
      <InputForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingState key="loading" destination={formData.destination} />
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
            <PlanOutput
              result={generatedPlan}
              destination={formData.destination}
              planMode={lastPlanMode}
              generationTier={generationTier}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FloatingCta onClick={scrollToForm} />

      <PaywallModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUnlock={handleUpgrade}
        isPaying={isPaying}
      />
    </div>
  );
}
