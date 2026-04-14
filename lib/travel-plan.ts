/** One timed stop in the day (meal, sight, walk, etc.) */
export type ScheduleStop = {
  /** e.g. "9:00 AM", "1:30 PM" */
  time: string;
  activity: string;
  place: string;
  /** e.g. "₹150–300", "Free", "~₹500" */
  estimatedCost: string;
  /** Local insight, e.g. "Avoid crowds after 5 PM" */
  localTip?: string;
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
  /** e.g. "Metro", "Auto", "Walk", "Cab" */
  mode?: string;
  /** e.g. "Heavy traffic 6–8 PM" */
  note?: string;
};

export type DayPlan = {
  day: number;
  title: string;
  /** Ordered day schedule with exact-ish times */
  schedule: ScheduleStop[];
  /** travelLegs[i] = travel after schedule[i] to schedule[i+1]; length should be schedule.length - 1 (or empty if one stop) */
  travelLegs: TravelLeg[];
};

export type BudgetBreakdown = {
  stay: string;
  food: string;
  transport: string;
};

export type ReelIdea = {
  hook: string;
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
  /** Camera height / lens feel / angle (e.g. low wide, 50mm portrait) */
  angle: string;
  /** Composition: rule of thirds, leading lines, foreground */
  composition: string;
  /** Light quality / best time */
  lighting: string;
};

export type BlogContent = {
  title: string;
  preview: string;
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
