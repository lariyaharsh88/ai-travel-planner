"use client";

import { FormEvent, useState } from "react";
import TravelResults from "@/components/TravelResults";
import { TravelPlanResponse } from "@/lib/travel-plan";

const travelStyles = ["budget", "luxury", "solo", "couple", "adventure"] as const;
const interestsList = [
  "food",
  "hidden places",
  "nature",
  "nightlife",
  "temples",
] as const;

type TravelStyle = (typeof travelStyles)[number];
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
        color: "#111827",
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
        className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="destination" className="mb-2 block text-sm font-medium">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={formData.destination}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, destination: event.target.value }))
              }
              placeholder="e.g. Bali"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="mb-2 block text-sm font-medium">
                Budget
              </label>
              <input
                id="budget"
                type="number"
                min={0}
                value={formData.budget}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, budget: Number(event.target.value) }))
                }
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                required
              />
            </div>

            <div>
              <label htmlFor="days" className="mb-2 block text-sm font-medium">
                Number of days
              </label>
              <input
                id="days"
                type="number"
                min={1}
                value={formData.days}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, days: Number(event.target.value) }))
                }
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="travelStyle" className="mb-2 block text-sm font-medium">
              Travel style
            </label>
            <select
              id="travelStyle"
              value={formData.travelStyle}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  travelStyle: event.target.value as TravelStyle,
                }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            >
              {travelStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium">Interests</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {interestsList.map((interest) => {
                const checked = formData.interests.includes(interest);
                return (
                  <label
                    key={interest}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-300 px-3 py-2 text-sm transition hover:border-zinc-500"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInterest(interest)}
                      className="h-4 w-4 rounded border-zinc-400 accent-black"
                    />
                    <span className="capitalize">{interest}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isLoading ? "Generating..." : "Generate Plan"}
        </button>
      </form>

      {generatedPlan ? <TravelResults result={generatedPlan} /> : null}

      {showUpgradeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Daily Free Limit Reached</h3>
            <p className="mt-2 text-sm text-zinc-700">Upgrade to generate more plans</p>
            <p className="mt-1 text-sm text-zinc-500">₹99 per plan</p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isPaying}
                className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-500"
              >
                {isPaying ? "Processing..." : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
