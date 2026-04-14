"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { FormEvent } from "react";
import BudgetDaysControls from "@/components/BudgetDaysControls";
import DestinationCombobox from "@/components/DestinationCombobox";
import PremiumInteractiveForm from "@/components/ui/PremiumInteractiveForm";
import { EASE_APPLE, EASE_APPLE_SOFT, springGentle } from "@/lib/motion-premium";
import PlanModeToggle from "@/components/planner/PlanModeToggle";
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
          <h3 className="type-display-lg mt-3 text-balance">Your trip, one brief</h3>
          <p className="type-body-muted mt-4 max-w-md">
            Creator Mode adds reels, IG spots, and camera angles — or stay on Normal for a trip-first plan.
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
        <PlanModeToggle
          value={formData.planMode}
          disabled={isLoading}
          onChange={(planMode) => setFormData((prev) => ({ ...prev, planMode }))}
        />
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
                  className={`min-h-[44px] rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400/40 ${
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
                  className={`min-h-[40px] rounded-full border px-3.5 py-2.5 text-xs font-medium capitalize transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400/40 sm:min-h-0 sm:py-2 ${
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
        whileHover={
          isLoading
            ? undefined
            : { scale: 1.015, y: -1, transition: { duration: 0.45, ease: EASE_APPLE_SOFT } }
        }
        whileTap={isLoading ? undefined : { scale: 0.988 }}
        transition={springGentle}
        className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[1.125rem] bg-[#14120f] px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_44px_-18px_rgba(15,23,42,0.4)] ring-1 ring-white/10 transition-[box-shadow] duration-500 hover:shadow-[0_22px_56px_-22px_rgba(15,23,42,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed disabled:opacity-55 sm:mt-10 sm:py-[1.125rem] sm:text-[0.9375rem]"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 45%, transparent 70%)",
          }}
        />
        <span className="relative z-[1] flex items-center gap-2">
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
        </span>
      </motion.button>
    </PremiumInteractiveForm>
  );
}
