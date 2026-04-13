"use client";

import type { CSSProperties } from "react";
import { useId } from "react";

const BUDGET_MIN = 0;
const BUDGET_MAX = 500_000;
const BUDGET_STEP = 500;
const DAYS_MIN = 1;
const DAYS_MAX = 30;

type BudgetDaysControlsProps = {
  budget: number;
  days: number;
  onBudgetChange: (n: number) => void;
  onDaysChange: (n: number) => void;
};

function formatInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
}

export default function BudgetDaysControls({
  budget,
  days,
  onBudgetChange,
  onDaysChange,
}: BudgetDaysControlsProps) {
  const exactBudgetId = useId();
  const presets = [5000, 25_000, 75_000, 200_000];
  const budgetPct = `${(Math.min(Math.max(budget, BUDGET_MIN), BUDGET_MAX) / BUDGET_MAX) * 100}%`;
  const daysPct = `${((Math.min(Math.max(days, DAYS_MIN), DAYS_MAX) - DAYS_MIN) / (DAYS_MAX - DAYS_MIN)) * 100}%`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-700">
          <span>Budget</span>
          <span
            className="rounded-md bg-stone-900/5 px-2 py-0.5 text-xs font-semibold tabular-nums text-stone-900"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatInr(budget)}
          </span>
        </legend>
        <div className="rounded-2xl border border-stone-200/90 bg-white p-3 shadow-inner">
          <input
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={Math.min(Math.max(budget, BUDGET_MIN), BUDGET_MAX)}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="range-slider w-full"
            aria-label="Adjust trip budget in Indian rupees"
            aria-valuemin={BUDGET_MIN}
            aria-valuemax={BUDGET_MAX}
            aria-valuenow={Math.min(Math.max(budget, BUDGET_MIN), BUDGET_MAX)}
            style={
              {
                "--range-pct": budgetPct,
                "--fill-color": "#FF6B35",
                "--thumb-color": "#e85a2a",
              } as CSSProperties
            }
          />
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Budget quick presets">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onBudgetChange(p)}
                aria-label={`Set budget to ${formatInr(p)}`}
                aria-pressed={budget === p}
                className={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] sm:text-xs ${
                  budget === p
                    ? "border-[#FF6B35]/60 bg-[#FF6B35]/10 text-stone-900"
                    : "border-stone-200 bg-white text-stone-600 hover:border-[#FF6B35]/35"
                }`}
              >
                {formatInr(p)}
              </button>
            ))}
          </div>
          <label htmlFor={exactBudgetId} className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-stone-600 sm:text-xs">Exact amount (₹)</span>
            <input
              id={exactBudgetId}
              type="number"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={budget}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isNaN(n)) return;
                onBudgetChange(Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, n)));
              }}
              className="w-full min-w-0 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm tabular-nums text-stone-900 outline-none focus:border-[#FF6B35]/60 focus:ring-2 focus:ring-[#FF6B35]/25"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-700">
          <span>Trip length</span>
          <span className="font-medium normal-case text-stone-600">days</span>
        </legend>
        <div
          className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/90 bg-white px-2 py-2 shadow-inner"
          role="group"
          aria-label="Adjust number of trip days"
        >
          <button
            type="button"
            aria-label="Decrease days"
            disabled={days <= DAYS_MIN}
            onClick={() => onDaysChange(Math.max(DAYS_MIN, days - 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-[#faf8f4] text-lg font-semibold text-stone-900 transition hover:bg-[#FF6B35]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <div className="flex min-w-0 flex-1 flex-col items-center" aria-live="polite" aria-atomic="true">
            <span className="text-3xl font-semibold tabular-nums leading-none text-stone-900">{days}</span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wider text-stone-600">days</span>
          </div>
          <button
            type="button"
            aria-label="Increase days"
            disabled={days >= DAYS_MAX}
            onClick={() => onDaysChange(Math.min(DAYS_MAX, days + 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-[#faf8f4] text-lg font-semibold text-stone-900 transition hover:bg-[#FF6B35]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
        <input
          type="range"
          min={DAYS_MIN}
          max={DAYS_MAX}
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className="range-slider mt-3 w-full"
          aria-valuemin={DAYS_MIN}
          aria-valuemax={DAYS_MAX}
          aria-valuenow={days}
          aria-label="Trip length in days"
          style={
            {
              "--range-pct": daysPct,
              "--fill-color": "#1c1917",
              "--thumb-color": "#292524",
            } as CSSProperties
          }
        />
      </fieldset>
    </div>
  );
}
