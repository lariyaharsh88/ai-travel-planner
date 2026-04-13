export const TRAVEL_STYLES = [
  { value: "budget", label: "Budget", hint: "Smart spends" },
  { value: "luxury", label: "Luxury", hint: "Premium stays" },
  { value: "solo", label: "Solo", hint: "Your pace" },
  { value: "couple", label: "Couple", hint: "Romantic" },
  { value: "adventure", label: "Adventure", hint: "Active & bold" },
] as const;

export type TravelStyleValue = (typeof TRAVEL_STYLES)[number]["value"];
