/** One timed stop in the day (meal, sight, walk, etc.) */
export type ScheduleStop = {
  /** Start time (keep for ordering), e.g. "9:00 AM" */
  time: string;
  /** Full block, e.g. "9:00–10:30 AM" — prefer showing this in UI when set */
  timeSlot?: string;
  activity: string;
  place: string;
  /** Prefer exact amounts: "₹180" or "₹45/person"; tight ranges only when necessary */
  estimatedCost: string;
  /**
   * Crowd timing, best entry window, common scams/pitfalls to avoid — specific to this place (INR context).
   */
  localTip?: string;
  /** Named dish, stall, price reality, neighborhood habit — insider detail */
  localInsight?: string;
  /** Full Google Maps URL (place or search link) */
  mapsLink: string;
  /** True if this is an offbeat / lesser-known spot (not a typical top-5 tourist trap) */
  hiddenGem?: boolean;
};

/** Travel between two consecutive stops */
export type TravelLeg = {
  fromPlace: string;
  toPlace: string;
  /** e.g. "~25 min", "15 min walk" */
  duration: string;
  /** Approximate distance for this leg, e.g. "~3.2 km" or "800 m walk" */
  distance?: string;
  /** e.g. "Metro", "Auto", "Walk", "Cab" */
  mode?: string;
  /** Concrete path: stations/lines/roads/exits — real-world navigable detail */
  route?: string;
  /** Fare for this leg only, e.g. "₹20 metro ×2" or "₹280 Uber" */
  legCost?: string;
  /** e.g. "Heavy traffic 6–8 PM" */
  note?: string;
  /** Other realistic options: auto vs cab vs walk, with rough INR when relevant */
  alternatives?: string;
};

export type DayPlan = {
  day: number;
  title: string;
  /** Ordered day schedule with exact-ish times */
  schedule: ScheduleStop[];
  /** travelLegs[i] = travel after schedule[i] to schedule[i+1]; length should be schedule.length - 1 (or empty if one stop) */
  travelLegs: TravelLeg[];
  /**
   * Estimated spend for this day only: entries, meals, local transport, activities
   * (exclude whole-trip stay unless the prompt states otherwise).
   */
  estimatedDayCost?: string;
};

export type BudgetBreakdown = {
  stay: string;
  food: string;
  transport: string;
  /** Whole-trip ballpark in INR (should align with per-day totals + stay where possible) */
  totalTripCost?: string;
};

export type ReelIdea = {
  hook: string;
  /** 15–40s beat-by-beat or shot list for filming */
  script?: string;
  caption: string;
  hashtags: string[];
};

/** Instagram-worthy stops (beyond generic “top sights”) */
export type InstagramSpot = {
  place: string;
  /** Why it works on the feed — color, symmetry, vibe */
  whyItWorks: string;
  /** Best time / light (e.g. golden hour, blue hour, empty morning) */
  bestTime: string;
  /** One concrete shot idea */
  shotIdea: string;
  /** Optional Maps link */
  mapsLink?: string;
};

/** Photographer-style notes: where + how to frame */
export type PhotoAngle = {
  spot: string;
  /** e.g. "Wide", "Drone", "POV" — vary across the set */
  shotType?: string;
  /** Camera height / lens feel / angle (e.g. low wide, 50mm portrait) */
  angle: string;
  /** Composition: rule of thirds, leading lines, foreground */
  composition: string;
  /** Light quality / best time (golden hour, sunset, blue hour) */
  lighting: string;
};

/** SEO-oriented section for long-form export */
export type BlogSectionBlock = {
  heading: string;
  body: string;
};

export type BlogContent = {
  title: string;
  preview: string;
  /** Optional H2-style sections with body copy — good for SEO outlines */
  seoSections?: BlogSectionBlock[];
};

export type TravelPlanResponse = {
  dayWisePlan: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  reelIdeas: ReelIdea[];
  instagramSpots: InstagramSpot[];
  photoAngles: PhotoAngle[];
  blogContent: BlogContent;
};

/** Ordered stops for map route + pins (preserves day flow; duplicates allowed) */
export type MapRoutePoint = {
  place: string;
  day: number;
  time: string;
  activity: string;
};

/** Flatten unique place names (legacy helpers / search) */
export function placesForMap(plan: TravelPlanResponse): string[] {
  return Array.from(
    new Set(
      plan.dayWisePlan.flatMap((d) => d.schedule.map((s) => s.place.trim()).filter(Boolean)),
    ),
  );
}

/** Stops in itinerary order for geocoding, routing, and numbered pins */
export function itineraryRouteForMap(plan: TravelPlanResponse): MapRoutePoint[] {
  return plan.dayWisePlan.flatMap((d) =>
    d.schedule.map((s) => ({
      place: s.place.trim(),
      day: d.day,
      time: s.time,
      activity: s.activity,
    })),
  ).filter((p) => p.place.length > 0);
}

export function mapsSearchUrlForPlace(place: string, destination?: string): string {
  const q = destination ? `${place}, ${destination}` : place;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
