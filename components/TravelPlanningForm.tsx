"use client";

import { FormEvent, useState } from "react";
import BudgetDaysControls from "@/components/BudgetDaysControls";
import DestinationCombobox from "@/components/DestinationCombobox";
import TravelResults from "@/components/TravelResults";
import TravelStyleSelect, { type TravelStyleValue } from "@/components/TravelStyleSelect";
import { TravelPlanResponse } from "@/lib/travel-plan";

const interestsList = [
  "food",
  "hidden places",
  "nature",
  "nightlife",
  "temples",
] as const;

type TravelStyle = TravelStyleValue;
type Interest = (typeof interestsList)[number];

type TravelFormData = {
  destination: string;
  budget: number;
  days: number;
  travelStyle: TravelStyle;
  interests: Interest[];
};

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

const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#475569]";

export default function TravelPlanningForm() {
  const [formData, setFormData] = useState<TravelFormData>({
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

  const toggleInterest = (interest: Interest) => {
    setFormData((prev) => {
      const isSelected = prev.interests.includes(interest);
      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const usageState = getUsageState();
    if (!canGenerate(usageState)) {
      setShowUpgradeModal(true);
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
      console.log("Generated travel plan:", data);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating the plan.";
      setError(message);
      setGeneratedPlan(null);
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
      return;
    }

    setIsPaying(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setIsPaying(false);
      setError("Failed to load Razorpay. Please try again.");
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: 9900,
      currency: "INR",
      name: "AI Travel Planner",
      description: "Unlock 1 additional travel plan",
      handler: (response) => {
        const currentUsage = getUsageState();
        const nextUsage = { ...currentUsage, paidCredits: currentUsage.paidCredits + 1 };
        saveUsageState(nextUsage);
        setShowUpgradeModal(false);
        setError(null);
        setIsPaying(false);
        console.log("Razorpay payment success:", response.razorpay_payment_id);
      },
      theme: {
        color: "#0c1829",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setIsPaying(false);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#0c1829]/10 bg-white/85 p-5 shadow-[0_18px_40px_-12px_rgba(12,24,41,0.14)] backdrop-blur-md sm:p-6 lg:mx-0 lg:max-w-none"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e3a5f] via-[#c9a227] to-[#e8a87c]"
          aria-hidden
        />
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#0c1829] sm:text-2xl">
            Plan your trip
          </h2>
          <span className="text-[10px] font-medium text-[#64748b] sm:text-xs">1 free / day</span>
        </div>
        <p className="mb-5 text-xs leading-relaxed text-[#64748b] sm:text-sm">
          Details below → full itinerary, map, and PDF export.
        </p>

        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-4 lg:space-y-0">
          <div className="lg:col-span-2">
            <label htmlFor="destination" className={labelClass}>
              Where to?
            </label>
            <DestinationCombobox
              id="destination"
              value={formData.destination}
              onChange={(destination) => setFormData((prev) => ({ ...prev, destination }))}
              required
            />
            <p className="mt-1.5 text-[10px] text-[#94a3b8] sm:text-xs">
              Search popular places or type your own.
            </p>
          </div>

          <div className="lg:col-span-2">
            <BudgetDaysControls
              budget={formData.budget}
              days={formData.days}
              onBudgetChange={(budget) => setFormData((prev) => ({ ...prev, budget }))}
              onDaysChange={(days) => setFormData((prev) => ({ ...prev, days }))}
            />
          </div>

          <fieldset className="min-w-0">
            <legend className={labelClass}>Travel style</legend>
            <TravelStyleSelect
              value={formData.travelStyle}
              onChange={(travelStyle) => setFormData((prev) => ({ ...prev, travelStyle }))}
            />
          </fieldset>

          <fieldset className="min-w-0">
            <legend className={labelClass}>Interests</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {interestsList.map((interest) => {
                const checked = formData.interests.includes(interest);
                return (
                  <label
                    key={interest}
                    className={`group flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition sm:text-sm ${
                      checked
                        ? "border-[#c9a227]/50 bg-[#c9a227]/10 text-[#0c1829] shadow-sm"
                        : "border-[#0c1829]/10 bg-white/60 text-[#475569] hover:border-[#c9a227]/35"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInterest(interest)}
                      className="h-4 w-4 rounded border-[#cbd5e1] text-[#c9a227] focus:ring-[#c9a227]/40"
                    />
                    <span className="capitalize">{interest}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {error ? (
          <p className="mt-6 rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#0c1829] via-[#1e3a5f] to-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#0c1829]/20 transition hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {isLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Crafting your itinerary…
            </span>
          ) : (
            "Generate my plan"
          )}
        </button>
      </form>

      {generatedPlan ? (
        <div className="animate-fade-in-up mx-auto max-w-3xl pt-1 lg:mx-0 lg:max-w-none">
          <TravelResults result={generatedPlan} />
        </div>
      ) : null}

      {showUpgradeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1829]/60 p-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white p-8 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-title"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e3a5f] via-[#c9a227] to-[#e8a87c]"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
              Premium
            </p>
            <h3 id="upgrade-title" className="font-[family-name:var(--font-playfair)] mt-2 text-2xl font-semibold text-[#0c1829]">
              Daily free limit reached
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
              Upgrade to generate more plans whenever inspiration strikes.
            </p>
            <p className="mt-2 text-lg font-semibold text-[#0c1829]">₹99 per plan</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full rounded-xl border border-[#0c1829]/15 bg-white px-4 py-3 text-sm font-semibold text-[#475569] transition hover:bg-[#f8f6f3]"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isPaying}
                className="w-full rounded-xl bg-gradient-to-r from-[#0c1829] to-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying ? "Opening…" : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
