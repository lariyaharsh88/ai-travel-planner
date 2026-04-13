"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { FormEvent } from "react";
import BudgetDaysControls from "@/components/BudgetDaysControls";
import DestinationCombobox from "@/components/DestinationCombobox";
import PremiumInteractiveForm from "@/components/ui/PremiumInteractiveForm";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
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
      transition={{ duration: 0.62, ease: EASE_APPLE }}
      className="p-5 sm:p-6"
      hoverLift={5}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1 rounded-t-[1.35rem] bg-gradient-to-r from-[#FF6B35] via-[#ff8f66] to-[#ffb347]"
        aria-hidden
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
            Your trip details
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            We’ll build a day-wise plan, map pins, budget, and content ideas.
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-stone-500"
        >
          1 free / day
        </motion.span>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label
            htmlFor="destination"
            className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500"
          >
            <MapPin className="h-3.5 w-3.5 text-[#FF6B35]" aria-hidden />
            Destination
          </label>
          <DestinationCombobox
            id="destination"
            value={formData.destination}
            onChange={(destination) => setFormData((prev) => ({ ...prev, destination }))}
            required
          />
          <p className="mt-2 text-xs text-stone-400">Search popular places or type your own.</p>
        </div>

        <BudgetDaysControls
          budget={formData.budget}
          days={formData.days}
          onBudgetChange={(budget) => setFormData((prev) => ({ ...prev, budget }))}
          onDaysChange={(days) => setFormData((prev) => ({ ...prev, days }))}
        />

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Travel style
          </p>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((s) => {
              const active = formData.travelStyle === s.value;
              return (
                <motion.button
                  key={s.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, travelStyle: s.value }))}
                  whileHover={{ y: -2, transition: { duration: 0.35, ease: EASE_APPLE } }}
                  whileTap={{ scale: 0.97 }}
                  transition={springGentle}
                  className={`rounded-full border px-4 py-2 text-left text-sm font-medium transition-shadow duration-300 ${
                    active
                      ? "border-[#FF6B35]/50 bg-gradient-to-br from-[#FF6B35]/12 to-amber-50/80 text-stone-900 shadow-[0_8px_24px_-12px_rgba(255,107,53,0.45)]"
                      : "border-stone-200/90 bg-white text-stone-600 shadow-sm hover:border-stone-300/90 hover:shadow-md"
                  }`}
                >
                  <span className="block capitalize">{s.label}</span>
                  <span className="mt-0.5 block text-[11px] font-normal text-stone-500">{s.hint}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Interests
          </p>
          <div className="flex flex-wrap gap-2">
            {interestsList.map((interest) => {
              const checked = formData.interests.includes(interest);
              return (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={springGentle}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium capitalize transition-colors duration-300 ${
                    checked
                      ? "border-[#FF6B35]/45 bg-stone-900 text-white shadow-md shadow-stone-900/20"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:shadow-sm"
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
        whileHover={isLoading ? undefined : { scale: 1.015, transition: { duration: 0.4, ease: EASE_APPLE } }}
        whileTap={isLoading ? undefined : { scale: 0.992 }}
        transition={springGentle}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(28,25,23,0.55)] ring-1 ring-white/10 transition-[box-shadow] duration-500 hover:shadow-[0_20px_50px_-8px_rgba(255,107,53,0.32)] disabled:cursor-not-allowed disabled:opacity-55 sm:text-base"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            Crafting your trip…
          </>
        ) : (
          "Generate my plan"
        )}
      </motion.button>
    </PremiumInteractiveForm>
  );
}
