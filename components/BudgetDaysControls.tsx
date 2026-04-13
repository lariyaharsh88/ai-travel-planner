"use client";

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
  const presets = [5000, 25_000, 75_000, 200_000];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">Budget</span>
          <span className="rounded-md bg-[#0c1829]/5 px-2 py-0.5 text-xs font-semibold tabular-nums text-[#0c1829]">
            {formatInr(budget)}
          </span>
        </div>
        <div className="rounded-xl border border-[#0c1829]/12 bg-white/95 p-3 shadow-inner">
          <input
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={Math.min(Math.max(budget, BUDGET_MIN), BUDGET_MAX)}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[#c9a227]"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onBudgetChange(p)}
                className={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition sm:text-xs ${
                  budget === p
                    ? "border-[#c9a227] bg-[#c9a227]/15 text-[#0c1829]"
                    : "border-[#0c1829]/10 bg-white text-[#64748b] hover:border-[#c9a227]/40"
                }`}
              >
                {formatInr(p)}
              </button>
            ))}
          </div>
          <label className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-[#94a3b8] sm:text-xs">Exact</span>
            <input
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
              className="w-full min-w-0 rounded-lg border border-[#0c1829]/10 bg-white px-2 py-1.5 text-sm tabular-nums outline-none focus:border-[#c9a227]/60 focus:ring-2 focus:ring-[#c9a227]/20"
            />
          </label>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">Trip length</span>
          <span className="text-xs font-medium text-[#64748b]">days</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#0c1829]/12 bg-white/95 px-2 py-2 shadow-inner">
          <button
            type="button"
            aria-label="Decrease days"
            disabled={days <= DAYS_MIN}
            onClick={() => onDaysChange(Math.max(DAYS_MIN, days - 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#0c1829]/10 bg-[#f8f6f3] text-lg font-semibold text-[#0c1829] transition hover:bg-[#c9a227]/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <div className="flex min-w-0 flex-1 flex-col items-center">
            <span className="text-3xl font-semibold tabular-nums leading-none text-[#0c1829]">{days}</span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wider text-[#94a3b8]">days</span>
          </div>
          <button
            type="button"
            aria-label="Increase days"
            disabled={days >= DAYS_MAX}
            onClick={() => onDaysChange(Math.min(DAYS_MAX, days + 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#0c1829]/10 bg-[#f8f6f3] text-lg font-semibold text-[#0c1829] transition hover:bg-[#c9a227]/15 disabled:cursor-not-allowed disabled:opacity-40"
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
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#1e3a5f]"
        />
      </div>
    </div>
  );
}
