"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { enterSoftTransition } from "@/lib/motion-premium";
import { toast } from "sonner";
import FloatingCta from "@/components/planner/FloatingCta";
import InputForm, { type InputFormData } from "@/components/planner/InputForm";
import LoadingState from "@/components/planner/LoadingState";
import PaywallModal from "@/components/planner/PaywallModal";
import PlanOutput from "@/components/planner/PlanOutput";
import {
  canGenerate,
  getUsageState,
  hasPremiumAccess,
  saveUsageState,
  type UsageState,
} from "@/lib/usage-storage";
import { DEFAULT_PLAN_MODE, type PlanMode } from "@/lib/plan-mode";
import { TravelPlanResponse } from "@/lib/travel-plan";

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
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function bumpUsageState(prev: UsageState, usesPremiumGeneration: boolean): UsageState {
  if (prev.premiumUnlocked) return prev;
  if (usesPremiumGeneration) {
    if ((prev.paidCredits ?? 0) > 0) {
      return { ...prev, paidCredits: Math.max(0, prev.paidCredits - 1) };
    }
    return prev;
  }
  return { ...prev, freeUsed: prev.freeUsed + 1 };
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
  const [usageRev, setUsageRev] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const usage = useMemo(() => getUsageState(), [usageRev]);
  const userHasPremium = hasPremiumAccess(usage);

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const scrollToForm = useCallback(() => {
    document.getElementById("planner-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const refreshUsage = useCallback(() => setUsageRev((n) => n + 1), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const usageState = getUsageState();
    if (!canGenerate(usageState)) {
      setShowUpgradeModal(true);
      toast.message("Unlock Premium Travel Plan", {
        description:
          "You’ve used today’s free preview. ₹99 unlocks the full itinerary, hidden gems, creator kit, budget & PDF.",
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
      const usesPremiumGeneration =
        before.premiumUnlocked === true || (before.paidCredits ?? 0) > 0;
      const next = bumpUsageState(before, usesPremiumGeneration);
      saveUsageState(next);
      refreshUsage();

      setLastPlanMode(formData.planMode);
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
      description: "Premium Travel Plan — full itinerary, gems, creator, budget & PDF",
      handler: () => {
        const current = getUsageState();
        saveUsageState({ ...current, premiumUnlocked: true, paidCredits: 0 });
        refreshUsage();
        setShowUpgradeModal(false);
        setError(null);
        setIsPaying(false);
        toast.success("Premium unlocked", {
          description: "Full itinerary, hidden gems, creator kit, budget & PDF — scroll to explore.",
        });
      },
      modal: {
        ondismiss: () => setIsPaying(false),
      },
      theme: {
        color: "#FF6B35",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const showFloatingUpgrade = Boolean(generatedPlan && !userHasPremium);

  return (
    <div className="space-y-10 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] sm:space-y-12 sm:pb-16">
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
            transition={enterSoftTransition}
            className="pt-2"
          >
            <PlanOutput
              result={generatedPlan}
              destination={formData.destination}
              planMode={lastPlanMode}
              hasPremiumAccess={userHasPremium}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FloatingCta
        onClick={scrollToForm}
        onUnlock={() => setShowUpgradeModal(true)}
        showUpgrade={showFloatingUpgrade}
      />

      <PaywallModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUnlock={handleUpgrade}
        isPaying={isPaying}
      />
    </div>
  );
}
