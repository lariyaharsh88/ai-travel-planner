export type UsageState = {
  date: string;
  freeUsed: number;
  /** Legacy per-generation credits (pre–lifetime unlock) */
  paidCredits: number;
  /** After successful ₹99 payment — unlimited premium generations & full UI */
  premiumUnlocked?: boolean;
};

export const USAGE_STORAGE_KEY = "ai-travel-planner-usage";
export const DAILY_FREE_LIMIT = 1;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeAndPersist(parsed: Partial<UsageState>, today: string): UsageState {
  let freeUsed = parsed.freeUsed ?? 0;
  let paidCredits = parsed.paidCredits ?? 0;
  let premiumUnlocked = parsed.premiumUnlocked === true;

  if (!premiumUnlocked && paidCredits > 0) {
    premiumUnlocked = true;
    paidCredits = 0;
  }

  const out: UsageState = {
    date: parsed.date ?? today,
    freeUsed,
    paidCredits,
    premiumUnlocked,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(out));
  }
  return out;
}

export function getUsageState(): UsageState {
  if (typeof window === "undefined") {
    return { date: getTodayKey(), freeUsed: 0, paidCredits: 0, premiumUnlocked: false };
  }

  try {
    const raw = window.localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), freeUsed: 0, paidCredits: 0, premiumUnlocked: false };

    const parsed = JSON.parse(raw) as Partial<UsageState>;
    const today = getTodayKey();
    if (parsed.date !== today) {
      const reset: UsageState = {
        date: today,
        freeUsed: 0,
        paidCredits: parsed.paidCredits ?? 0,
        premiumUnlocked: parsed.premiumUnlocked === true,
      };
      return normalizeAndPersist(reset, today);
    }

    return normalizeAndPersist(parsed, today);
  } catch {
    return { date: getTodayKey(), freeUsed: 0, paidCredits: 0, premiumUnlocked: false };
  }
}

export function saveUsageState(nextState: UsageState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(nextState));
}

export function hasPremiumAccess(state: UsageState): boolean {
  return state.premiumUnlocked === true || (state.paidCredits ?? 0) > 0;
}

export function canGenerate(state: UsageState): boolean {
  if (hasPremiumAccess(state)) return true;
  return state.freeUsed < DAILY_FREE_LIMIT;
}
