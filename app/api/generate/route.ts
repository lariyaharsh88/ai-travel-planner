import { NextResponse } from "next/server";
import {
  type DayPlan,
  type InstagramSpot,
  type PhotoAngle,
  type ReelIdea,
  type ScheduleStop,
  type TravelLeg,
  type BlogSectionBlock,
  type TravelPlanResponse,
  mapsSearchUrlForPlace,
} from "@/lib/travel-plan";
import { type PlanMode } from "@/lib/plan-mode";

type GenerateRequestBody = {
  destination: string;
  budget: number;
  days: number;
  style: string;
  interests: string[];
  planMode?: PlanMode;
};

function isValidBody(body: unknown): body is GenerateRequestBody {
  if (!body || typeof body !== "object") return false;

  const candidate = body as Partial<GenerateRequestBody>;
  const planModeOk =
    candidate.planMode === undefined ||
    candidate.planMode === "standard" ||
    candidate.planMode === "creator";
  return (
    typeof candidate.destination === "string" &&
    candidate.destination.trim().length > 0 &&
    typeof candidate.budget === "number" &&
    Number.isFinite(candidate.budget) &&
    candidate.budget >= 0 &&
    typeof candidate.days === "number" &&
    Number.isFinite(candidate.days) &&
    candidate.days > 0 &&
    typeof candidate.style === "string" &&
    candidate.style.trim().length > 0 &&
    Array.isArray(candidate.interests) &&
    candidate.interests.every((item) => typeof item === "string") &&
    planModeOk
  );
}

function extractJson(rawText: string): string {
  const fenced = rawText.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return rawText.slice(firstBrace, lastBrace + 1);
  }

  return rawText;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Prefer INR symbol in cost strings */
function normalizeInrCostString(raw: string): string {
  const t = raw.trim();
  if (/[₹]|INR|inr|rupee/i.test(t)) return t;
  if (/^free$/i.test(t)) return t;
  if (/^\d/.test(t)) return `₹${t}`;
  return t;
}

function normalizeStop(raw: unknown, destination: string): ScheduleStop {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid schedule stop");
  }
  const s = raw as Partial<ScheduleStop>;
  if (
    !isNonEmptyString(s.time) ||
    !isNonEmptyString(s.activity) ||
    !isNonEmptyString(s.place) ||
    !isNonEmptyString(s.estimatedCost)
  ) {
    throw new Error("Schedule stop missing time, activity, place, or estimatedCost");
  }
  let mapsLink = isNonEmptyString(s.mapsLink) ? s.mapsLink.trim() : "";
  if (!mapsLink.startsWith("http")) {
    mapsLink = mapsSearchUrlForPlace(s.place, destination);
  }
  const timeSlot =
    isNonEmptyString(s.timeSlot) && s.timeSlot.trim().length > 0
      ? s.timeSlot.trim()
      : `${s.time.trim()} – (set end time)`;
  const localTip =
    isNonEmptyString(s.localTip) && s.localTip.trim().length > 0
      ? s.localTip.trim()
      : "Crowd, entry, and local pitfalls: confirm at the venue the same day — avoid rush if lines look long.";
  const localInsight =
    isNonEmptyString(s.localInsight) && s.localInsight.trim().length > 0
      ? s.localInsight.trim()
      : undefined;

  return {
    time: s.time.trim(),
    timeSlot,
    activity: s.activity.trim(),
    place: s.place.trim(),
    estimatedCost: normalizeInrCostString(s.estimatedCost),
    localTip,
    localInsight,
    mapsLink,
    hiddenGem: typeof s.hiddenGem === "boolean" ? s.hiddenGem : undefined,
  };
}

function normalizeLeg(raw: unknown): TravelLeg {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid travel leg");
  }
  const l = raw as Partial<TravelLeg> & { alternatives?: string };
  if (
    !isNonEmptyString(l.fromPlace) ||
    !isNonEmptyString(l.toPlace) ||
    !isNonEmptyString(l.duration)
  ) {
    throw new Error("Travel leg missing fromPlace, toPlace, or duration");
  }
  const distanceRaw = isNonEmptyString(l.distance) ? l.distance.trim() : "";
  const distance =
    distanceRaw.length > 0 ? distanceRaw : "~2 km (estimate — model should return real km)";

  return {
    fromPlace: l.fromPlace.trim(),
    toPlace: l.toPlace.trim(),
    duration: l.duration.trim(),
    distance,
    mode: isNonEmptyString(l.mode) ? l.mode.trim() : "Auto / cab / walk (pick one for this leg)",
    route: isNonEmptyString(l.route) ? l.route.trim() : "Use maps for the fastest path between these pins.",
    legCost: isNonEmptyString(l.legCost) ? normalizeInrCostString(l.legCost) : "₹0–150 (mode-dependent)",
    note: isNonEmptyString(l.note) ? l.note.trim() : undefined,
    alternatives: isNonEmptyString(l.alternatives) ? l.alternatives.trim() : undefined,
  };
}

/** Legacy: activities[] + places[] → schedule + empty legs */
function coerceLegacyDay(
  day: unknown,
  destination: string,
): DayPlan {
  if (!day || typeof day !== "object") throw new Error("Invalid day");
  const d = day as {
    day?: number;
    title?: string;
    activities?: unknown;
    places?: unknown;
  };
  const activities = Array.isArray(d.activities)
    ? d.activities.filter((a): a is string => typeof a === "string" && a.trim().length > 0)
    : [];
  const places = Array.isArray(d.places)
    ? d.places.filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    : [];
  if (activities.length === 0) {
    throw new Error("Day has no schedule and no activities");
  }
  const n = activities.length;
  const schedule: ScheduleStop[] = activities.map((activity, i) => {
    const place =
      places[i]?.trim() ||
      places[0]?.trim() ||
      destination;
    return {
      time: `${9 + i * 2}:00 AM`,
      activity: activity.trim(),
      place,
      estimatedCost: "—",
      mapsLink: mapsSearchUrlForPlace(place, destination),
      hiddenGem: false,
    };
  });
  const travelLegs: TravelLeg[] = [];
  for (let i = 0; i < n - 1; i++) {
    const fromPlace = schedule[i].place;
    const toPlace = schedule[i + 1].place;
    travelLegs.push({
      fromPlace,
      toPlace,
      duration: "~20–40 min (estimate)",
      note: "Adjust based on traffic and mode",
    });
  }
  return {
    day: typeof d.day === "number" && Number.isFinite(d.day) ? d.day : 1,
    title: isNonEmptyString(d.title) ? d.title.trim() : `Day ${d.day ?? 1}`,
    schedule,
    travelLegs,
  };
}

function normalizeDayPlan(day: unknown, destination: string): DayPlan {
  if (!day || typeof day !== "object") {
    throw new Error("Invalid day plan");
  }
  const d = day as Partial<DayPlan> & {
    activities?: string[];
    places?: string[];
  };

  const hasSchedule = Array.isArray(d.schedule) && d.schedule.length > 0;
  if (!hasSchedule) {
    return enforceDayPlanConstraints(coerceLegacyDay(day, destination));
  }

  const schedule = d.schedule!.map((s) => normalizeStop(s, destination));
  let travelLegs: TravelLeg[] = [];
  if (Array.isArray(d.travelLegs) && d.travelLegs.length > 0) {
    travelLegs = d.travelLegs.map(normalizeLeg);
  } else if (schedule.length > 1) {
    for (let i = 0; i < schedule.length - 1; i++) {
      travelLegs.push({
        fromPlace: schedule[i].place,
        toPlace: schedule[i + 1].place,
        duration: "~20–40 min (estimate)",
        note: "Fill in realistic duration when known",
      });
    }
  }

  const expectedLegs = Math.max(0, schedule.length - 1);
  if (travelLegs.length !== expectedLegs) {
    if (travelLegs.length < expectedLegs) {
      for (let i = travelLegs.length; i < expectedLegs; i++) {
        travelLegs.push({
          fromPlace: schedule[i].place,
          toPlace: schedule[i + 1].place,
          duration: "~20–40 min",
        });
      }
    } else {
      travelLegs = travelLegs.slice(0, expectedLegs);
    }
  }

  const base: DayPlan = {
    day: typeof d.day === "number" && Number.isFinite(d.day) ? d.day : 1,
    title: isNonEmptyString(d.title) ? d.title.trim() : `Day ${d.day ?? 1}`,
    schedule,
    travelLegs,
    estimatedDayCost: isNonEmptyString(d.estimatedDayCost)
      ? d.estimatedDayCost.trim()
      : undefined,
  };
  return enforceDayPlanConstraints(base);
}

/** Exactly two hidden gems per day when ≥2 stops; trim extras; fill shortage. */
function enforceDayPlanConstraints(day: DayPlan): DayPlan {
  let schedule = day.schedule.map((s) => ({ ...s }));
  if (schedule.length >= 2) {
    const hiddenCount = schedule.filter((s) => s.hiddenGem === true).length;
    if (hiddenCount > 2) {
      let kept = 0;
      schedule = schedule.map((s) => {
        if (!s.hiddenGem) return s;
        kept++;
        if (kept <= 2) return s;
        return { ...s, hiddenGem: false };
      });
    } else if (hiddenCount < 2) {
      let need = 2 - hiddenCount;
      for (let i = 0; i < schedule.length && need > 0; i++) {
        if (!schedule[i].hiddenGem) {
          schedule[i] = { ...schedule[i], hiddenGem: true };
          need--;
        }
      }
    }
  }

  let estimatedDayCost = day.estimatedDayCost;
  if (!isNonEmptyString(estimatedDayCost ?? "")) {
    estimatedDayCost =
      "Total this day: add per-stop ₹ in schedule + leg fares below (hotel excluded unless stated).";
  }

  return {
    ...day,
    schedule,
    estimatedDayCost,
  };
}

function normalizeReelIdea(raw: unknown): ReelIdea | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<ReelIdea>;
  if (!isNonEmptyString(r.hook) || !isNonEmptyString(r.caption) || !Array.isArray(r.hashtags)) {
    return null;
  }
  const hashtags = r.hashtags.filter(
    (t): t is string => typeof t === "string" && t.trim().length > 0,
  );
  if (hashtags.length === 0) return null;
  return {
    hook: r.hook.trim(),
    script: isNonEmptyString(r.script) ? r.script.trim() : undefined,
    caption: r.caption.trim(),
    hashtags,
  };
}

function normalizeInstagramSpot(raw: unknown): InstagramSpot | null {
  if (!raw || typeof raw !== "object") return null;
  const x = raw as Partial<InstagramSpot>;
  if (
    !isNonEmptyString(x.place) ||
    !isNonEmptyString(x.whyItWorks) ||
    !isNonEmptyString(x.bestTime) ||
    !isNonEmptyString(x.shotIdea)
  ) {
    return null;
  }
  let mapsLink: string | undefined;
  if (isNonEmptyString(x.mapsLink) && x.mapsLink.trim().startsWith("http")) {
    mapsLink = x.mapsLink.trim();
  }
  return {
    place: x.place.trim(),
    whyItWorks: x.whyItWorks.trim(),
    bestTime: x.bestTime.trim(),
    shotIdea: x.shotIdea.trim(),
    mapsLink,
  };
}

function normalizeBlogSection(raw: unknown): BlogSectionBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const x = raw as Partial<BlogSectionBlock>;
  if (!isNonEmptyString(x.heading) || !isNonEmptyString(x.body)) return null;
  return { heading: x.heading.trim(), body: x.body.trim() };
}

function normalizePhotoAngle(raw: unknown): PhotoAngle | null {
  if (!raw || typeof raw !== "object") return null;
  const x = raw as Partial<PhotoAngle>;
  if (
    !isNonEmptyString(x.spot) ||
    !isNonEmptyString(x.angle) ||
    !isNonEmptyString(x.composition) ||
    !isNonEmptyString(x.lighting)
  ) {
    return null;
  }
  const shotType =
    isNonEmptyString(x.shotType) && x.shotType.trim().length > 0 ? x.shotType.trim() : undefined;
  return {
    spot: x.spot.trim(),
    ...(shotType ? { shotType } : {}),
    angle: x.angle.trim(),
    composition: x.composition.trim(),
    lighting: x.lighting.trim(),
  };
}

function normalizeResponse(data: unknown, destination: string): TravelPlanResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid JSON from model");
  }

  const parsed = data as Partial<TravelPlanResponse>;
  if (
    !Array.isArray(parsed.dayWisePlan) ||
    !parsed.budgetBreakdown ||
    !Array.isArray(parsed.reelIdeas) ||
    !parsed.blogContent
  ) {
    throw new Error("Missing required response keys");
  }

  if (
    typeof parsed.budgetBreakdown.stay !== "string" ||
    typeof parsed.budgetBreakdown.food !== "string" ||
    typeof parsed.budgetBreakdown.transport !== "string" ||
    typeof parsed.blogContent.title !== "string" ||
    typeof parsed.blogContent.preview !== "string"
  ) {
    throw new Error("Invalid response format");
  }

  const totalTripCostRaw = parsed.budgetBreakdown.totalTripCost;
  let totalTripCost =
    typeof totalTripCostRaw === "string" && totalTripCostRaw.trim().length > 0
      ? totalTripCostRaw.trim()
      : undefined;

  const seoSections = Array.isArray(parsed.blogContent.seoSections)
    ? parsed.blogContent.seoSections
        .map((s) => normalizeBlogSection(s))
        .filter((x): x is BlogSectionBlock => x !== null)
    : undefined;

  const dayWisePlan = parsed.dayWisePlan.map((d) => normalizeDayPlan(d, destination));

  if (!totalTripCost) {
    totalTripCost =
      "Full trip (INR): add each day’s estimatedDayCost to your stay line — use food/transport rows for the rest.";
  }

  const reelIdeas = parsed.reelIdeas
    .map(normalizeReelIdea)
    .filter((x): x is ReelIdea => x !== null);

  const instagramSpots = Array.isArray(parsed.instagramSpots)
    ? parsed.instagramSpots
        .map((x) => normalizeInstagramSpot(x))
        .filter((x): x is InstagramSpot => x !== null)
    : [];

  const photoAngles = Array.isArray(parsed.photoAngles)
    ? parsed.photoAngles.map(normalizePhotoAngle).filter((x): x is PhotoAngle => x !== null)
    : [];

  return {
    dayWisePlan,
    budgetBreakdown: {
      stay: parsed.budgetBreakdown.stay,
      food: parsed.budgetBreakdown.food,
      transport: parsed.budgetBreakdown.transport,
      totalTripCost,
    },
    reelIdeas,
    instagramSpots,
    photoAngles,
    blogContent: {
      title: parsed.blogContent.title,
      preview: parsed.blogContent.preview,
      ...(seoSections && seoSections.length > 0 ? { seoSections } : {}),
    },
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY in environment variables." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as unknown;
    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Expected destination, budget, days, style, and interests.",
        },
        { status: 400 },
      );
    }

    const dest = body.destination.trim();
    const planMode: PlanMode = body.planMode ?? "standard";

    const modeBlock =
      planMode === "creator"
        ? `
SECONDARY — Creator Mode (must be feed-ready; after itinerary is solid):
- "instagramSpots": ≥8; each must name a REAL place on the route; "whyItWorks" = color/symmetry/vibe; "bestTime" MUST name lighting windows (golden hour, blue hour, sunset, harsh midday to avoid, etc.) for THIS place.
- "reelIdeas": ≥6; each MUST have: hook (scroll-stopping opener), caption (IG-ready), "script" non-empty (beats + shot list); tie to named stops/times.
- "photoAngles": ≥9; each row MUST include "shotType" exactly one of: "Wide" | "Drone" | "POV" (rotate across rows so all three appear multiple times); "angle" = lens/height feel; "lighting" = best time for that frame (golden hour, sunset, etc.).
`
        : `
SECONDARY — Creator kit (lighter — user did not choose Creator Mode in UI):
- "reelIdeas": ≥3; "instagramSpots": ≥3; "photoAngles": ≥4; keep "shotType" optional; still tie to named places.
`;

    const prompt = `
You are a LOCAL expert trip planner (not a generic travel blog). Write ONLY for this destination: ${dest}.
Trip: ${body.days} day(s). Budget context (INR): ${body.budget}. Style: ${body.style}. Interests: ${body.interests.join(", ")}.
Plan mode: ${planMode === "creator" ? "Creator (extra content below)" : "Trip-first"}.
${modeBlock}

PRIMARY OUTPUT — REAL-WORLD ITINERARY (this is what matters):
1) DAYS: Produce exactly ${body.days} day object(s) in "dayWisePlan", "day" = 1..${body.days}.
2) TIME SLOTS: Every stop MUST have:
   - "time" = start time (e.g. "9:00 AM").
   - "timeSlot" = full inclusive block using an en dash or hyphen, e.g. "9:00 AM – 11:00 AM" (never "morning only").
   Schedules must be physically possible: no overlapping timeSlots; travel time between stops must fit in the gaps.
3) STOPS: Each stop must be a concrete ACTION at a NAMED place (venue, neighborhood, or landmark). Banned phrases: "explore the local culture", "enjoy the scenery", "famous landmark", "authentic experience" without naming WHAT/WHERE.
4) COSTS (INR): Every stop MUST have "estimatedCost" with ₹ symbol (e.g. "₹120 entry", "₹450 for two", "Free"). Prefer single numbers or tight ranges; say what it covers.
5) HIDDEN GEMS: On EACH day with at least 2 stops, mark EXACTLY TWO different stops with "hiddenGem": true. Those must be real, non-touristy picks (local market lane, neighbourhood cafe, viewpoint locals use — NOT the same mega-attraction twice). All other stops "hiddenGem": false.
6) INSIDER TIPS — Every stop MUST have "localTip" (non-empty string) that includes ALL of:
   - Crowd timing (when to go or when to avoid),
   - Best entry window (e.g. gate opens, queue pattern),
   - One scam/pitfall or common rip-off to avoid at THIS place (if none, say "No common scam here — still pay metered auto / use official counter only").
   Also include "localInsight" on every stop: one hyper-specific detail (named dish, stall, price band, or neighbourhood habit).
7) TOTAL DAILY COST: Each day MUST include "estimatedDayCost": one line in INR totalling that day's stops + legs (exclude hotel for multi-day unless you explicitly fold a night stay into that day).
8) TRIP TOTAL: "budgetBreakdown" MUST include "totalTripCost": one line in INR for the whole trip (stay + food + local transport + activities + intercity as applicable), as a realistic range (e.g. "₹42,000–₹48,000 total trip") that roughly matches the sum of per-day "estimatedDayCost" lines + stay allocation.
9) TRAVEL BETWEEN STOPS: For every consecutive pair of stops, one "travelLeg" (length = schedule.length - 1). Each leg MUST include:
   - "duration" — realistic total time (e.g. "~35 min" including wait).
   - "distance" — distance in km or metres for walks, e.g. "~4.2 km" or "~650 m walk".
   - "mode" — PRIMARY mode for this leg: one of "Walk", "Auto", "App cab", "Metro", "Bus", "Bike rental", "Ferry", "Train" (pick what fits).
   - "alternatives" — one line suggesting other realistic options (e.g. "Auto ₹60–90 vs Metro ₹20 · 25 min walk if you prefer").
   - "route" — navigable detail: road names, metro line + station, or walking landmarks.
   - "legCost" — INR for this leg only.
   - "note" — traffic/rush hour or crowd risk (specific hours if relevant).

MAPS: Every "mapsLink" must be a full https://www.google.com/maps/ URL for that stop.

Return ONLY valid JSON (no markdown, no commentary) with this schema:
{
  "dayWisePlan": [
    {
      "day": 1,
      "title": "string",
      "estimatedDayCost": "₹X–Y total this day (breakdown in stops)",
      "schedule": [
        {
          "time": "9:00 AM",
          "timeSlot": "9:00 AM – 11:00 AM",
          "activity": "string",
          "place": "string",
          "estimatedCost": "₹…",
          "localTip": "crowd + entry + scam/pitfall for THIS place",
          "localInsight": "named insider detail",
          "mapsLink": "https://www.google.com/maps/...",
          "hiddenGem": false
        }
      ],
      "travelLegs": [
        {
          "fromPlace": "string",
          "toPlace": "string",
          "duration": "~22 min",
          "distance": "~3.2 km",
          "mode": "Auto",
          "alternatives": "App cab · Metro line X · walk",
          "route": "concrete navigation",
          "legCost": "₹…",
          "note": "rush hour / risk"
        }
      ]
    }
  ],
  "budgetBreakdown": { "stay": "string", "food": "string", "transport": "string", "totalTripCost": "₹X–Y total trip (all days + stay)" },
  "reelIdeas": [{ "hook": "string", "script": "string", "caption": "string", "hashtags": ["#a"] }],
  "instagramSpots": [{ "place": "string", "whyItWorks": "string", "bestTime": "string", "shotIdea": "string", "mapsLink": "https://..." }],
  "photoAngles": [{ "spot": "string", "shotType": "Wide | Drone | POV", "angle": "string", "composition": "string", "lighting": "string" }],
  "blogContent": {
    "title": "string",
    "preview": "string",
    "seoSections": [{ "heading": "string", "body": "string" }]
  }
}

Hard rules: travelLegs.length === schedule.length - 1 per day. "budgetBreakdown.totalTripCost" is REQUIRED. "instagramSpots" and "photoAngles" arrays must exist. Every "reelIdeas" item MUST include "script". "blogContent.seoSections" MUST have 3–5 sections. Two "hiddenGem": true per day when schedule has ≥2 stops.
`.trim();

    const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              planMode === "creator"
                ? "You are a local expert trip planner for India + worldwide. Output ONLY valid JSON. No markdown. Prioritize a hyper-practical day-by-day schedule: exact timeSlots, INR costs, travel legs with km + time + mode + alternatives, two real hidden gems per day, and insider tips (crowd, entry, scams). budgetBreakdown.totalTripCost must reconcile with per-day spend + stay. Then fill creator fields. Reject generic travel-blog filler."
                : "You are a local expert trip planner. Output ONLY valid JSON. No markdown. Every day: exact timeSlots (e.g. 9:00 AM – 11:00 AM), INR per activity, legs with km/duration/mode/alternatives, total daily cost, two hidden gems per day, insider tips (crowd, entry, scams), and budgetBreakdown.totalTripCost. Then a lighter creator kit. Reject vague language.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.32,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      if (groqResponse.status === 429) {
        return NextResponse.json(
          { error: "Groq quota exceeded. Please try again later.", details: errorText },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: "Groq request failed.", details: errorText },
        { status: 502 },
      );
    }

    const result = (await groqResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const rawText = result.choices?.[0]?.message?.content;
    if (!rawText) {
      return NextResponse.json(
        { error: "Groq returned an empty response." },
        { status: 502 },
      );
    }

    const parsed = normalizeResponse(JSON.parse(extractJson(rawText)), dest);
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate travel plan.", details: message },
      { status: 500 },
    );
  }
}
