"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { FormEvent } from "react";
import BudgetDaysControls from "@/components/BudgetDaysControls";
import DestinationCombobox from "@/components/DestinationCombobox";
import PremiumInteractiveForm from "@/components/ui/PremiumInteractiveForm";
import { EASE_APPLE, EASE_APPLE_SOFT, springGentle } from "@/lib/motion-premium";
import { type PlanMode } from "@/lib/plan-mode";
import { TRAVEL_STYLES, type TravelStyleValue } from "@/lib/travel-styles";

const interestsList = [
  "food",
  "hidden places",
  "nature",
  "nightlife",
  "temples",
] as const;

export type Interest = (typeof interestsList)[number];

export type InputFormData = {
  destination: string;
  budget: number;
  days: number;
  travelStyle: TravelStyleValue;
  interests: Interest[];
  planMode: PlanMode;
};

type InputFormProps = {
  formData: InputFormData;
  setFormData: React.Dispatch<React.SetStateAction<InputFormData>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
};

export default function InputForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  error,
}: InputFormProps) {
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

  return (
    <PremiumInteractiveForm
      id="planner-form"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: EASE_APPLE_SOFT }}
      className="p-8 sm:p-10"
      hoverLift={2}
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="type-eyebrow text-[#c2410c]/90">Plan</p>
          <h3 className="type-display mt-3 text-[1.375rem] sm:text-[1.5rem]">Your trip, one brief</h3>
          <p className="type-body-muted mt-4 max-w-md">
            Route, timing, and creator outputs — minimal inputs, maximum clarity.
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="shrink-0 rounded-full border border-stone-200/80 bg-stone-50/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500"
        >
          1 free / day
        </motion.span>
      </div>

      <div className="mb-10">
        <p id="plan-mode-label" className="type-eyebrow mb-4">
          Plan type
        </p>
        <div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="radiogroup"
          aria-labelledby="plan-mode-label"
        >
          {(
            [
              { value: "standard" as const, title: "Trip-first", desc: "Route, map, and budget." },
              { value: "creator" as const, title: "Creator", desc: "Spots, reels, angles, and light." },
            ] as const
          ).map(({ value, title, desc }) => {
            const active = formData.planMode === value;
            return (
              <motion.button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFormData((prev) => ({ ...prev, planMode: value }))}
                whileHover={{ y: -1, transition: { duration: 0.45, ease: EASE_APPLE_SOFT } }}
                whileTap={{ scale: 0.99 }}
                transition={springGentle}
                className={`rounded-2xl border px-4 py-4 text-left transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400/40 ${
                  active
                    ? "border-stone-900/15 bg-stone-50 text-stone-900 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.12)]"
                    : "border-stone-200/80 bg-white text-stone-800 hover:border-stone-300/90"
                }`}
              >
                <span className="block text-sm font-medium tracking-tight">{title}</span>
                <span className="mt-1.5 block text-[13px] font-normal leading-snug text-stone-500">{desc}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="space-y-8 sm:space-y-12">
        <div className="relative">
          <label
            htmlFor="destination"
            className="type-eyebrow mb-3 flex items-center gap-2"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
            Destination
          </label>
          <DestinationCombobox
            id="destination"
            value={formData.destination}
            onChange={(destination) => setFormData((prev) => ({ ...prev, destination }))}
            required
            describedBy="destination-hint"
          />
          <p id="destination-hint" className="mt-3 text-sm text-stone-500">
            Search or type any place.
          </p>
        </div>

        <BudgetDaysControls
          budget={formData.budget}
          days={formData.days}
          onBudgetChange={(budget) => setFormData((prev) => ({ ...prev, budget }))}
          onDaysChange={(days) => setFormData((prev) => ({ ...prev, days }))}
        />

        <div>
          <p id="travel-style-label" className="type-eyebrow mb-4">
            Travel style
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="travel-style-label"
          >
            {TRAVEL_STYLES.map((s) => {
              const active = formData.travelStyle === s.value;
              return (
                <motion.button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setFormData((prev) => ({ ...prev, travelStyle: s.value }))}
                  whileHover={{ y: -1, transition: { duration: 0.45, ease: EASE_APPLE_SOFT } }}
                  whileTap={{ scale: 0.99 }}
                  transition={springGentle}
                  className={`rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400/40 ${
                    active
                      ? "border-stone-800/20 bg-stone-900 text-white"
                      : "border-stone-200/90 bg-white text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <span className="block capitalize">{s.label}</span>
                  <span
                    className={`mt-0.5 block text-[11px] font-normal ${
                      active ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {s.hint}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <p id="interests-label" className="type-eyebrow mb-4">
            Interests
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="interests-label">
            {interestsList.map((interest) => {
              const checked = formData.interests.includes(interest);
              return (
                <motion.button
                  key={interest}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => toggleInterest(interest)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springGentle}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium capitalize transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400/40 ${
                    checked
                      ? "border-stone-800 bg-stone-900 text-white"
                      : "border-stone-200/90 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {interest}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {error ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_APPLE }}
          className="mt-5 rounded-2xl border border-red-200/90 bg-red-50/95 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </motion.p>
      ) : null}

      <motion.button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        whileHover={isLoading ? undefined : { scale: 1.01, transition: { duration: 0.5, ease: EASE_APPLE_SOFT } }}
        whileTap={isLoading ? undefined : { scale: 0.995 }}
        transition={springGentle}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14120f] px-5 py-4 text-sm font-medium text-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.35)] transition-[box-shadow,transform] duration-500 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed disabled:opacity-55 sm:text-[0.9375rem]"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            {formData.destination.trim()
              ? `Planning your ${formData.destination.trim()} trip…`
              : "Planning your trip…"}
          </>
        ) : (
          "Generate my plan"
        )}
      </motion.button>
    </PremiumInteractiveForm>
  );
}
