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

function normalizeStop(
  raw: unknown,
  destination: string,
): ScheduleStop {
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
  return {
    time: s.time.trim(),
    timeSlot: isNonEmptyString(s.timeSlot) ? s.timeSlot.trim() : undefined,
    activity: s.activity.trim(),
    place: s.place.trim(),
    estimatedCost: s.estimatedCost.trim(),
    localTip: isNonEmptyString(s.localTip) ? s.localTip.trim() : undefined,
    localInsight: isNonEmptyString(s.localInsight) ? s.localInsight.trim() : undefined,
    mapsLink,
    hiddenGem: typeof s.hiddenGem === "boolean" ? s.hiddenGem : undefined,
  };
}

function normalizeLeg(raw: unknown): TravelLeg {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid travel leg");
  }
  const l = raw as Partial<TravelLeg>;
  if (
    !isNonEmptyString(l.fromPlace) ||
    !isNonEmptyString(l.toPlace) ||
    !isNonEmptyString(l.duration)
  ) {
    throw new Error("Travel leg missing fromPlace, toPlace, or duration");
  }
  return {
    fromPlace: l.fromPlace.trim(),
    toPlace: l.toPlace.trim(),
    duration: l.duration.trim(),
    distance: isNonEmptyString(l.distance) ? l.distance.trim() : undefined,
    mode: isNonEmptyString(l.mode) ? l.mode.trim() : undefined,
    route: isNonEmptyString(l.route) ? l.route.trim() : undefined,
    legCost: isNonEmptyString(l.legCost) ? l.legCost.trim() : undefined,
    note: isNonEmptyString(l.note) ? l.note.trim() : undefined,
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
    return coerceLegacyDay(day, destination);
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

  return {
    day: typeof d.day === "number" && Number.isFinite(d.day) ? d.day : 1,
    title: isNonEmptyString(d.title) ? d.title.trim() : `Day ${d.day ?? 1}`,
    schedule,
    travelLegs,
    estimatedDayCost: isNonEmptyString(d.estimatedDayCost)
      ? d.estimatedDayCost.trim()
      : undefined,
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
  return {
    spot: x.spot.trim(),
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

  const seoSections = Array.isArray(parsed.blogContent.seoSections)
    ? parsed.blogContent.seoSections
        .map((s) => normalizeBlogSection(s))
        .filter((x): x is BlogSectionBlock => x !== null)
    : undefined;

  const dayWisePlan = parsed.dayWisePlan.map((d) => normalizeDayPlan(d, destination));

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
    budgetBreakdown: parsed.budgetBreakdown,
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
CREATOR / INSTAGRAM MODE (primary deliverable — optimize for posting):
- Best photo spots: "instagramSpots" must be ≥8. Each card needs a sharp "shotIdea", "whyItWorks" that sounds like a creator brief (not generic), and a mapsLink.
- Reel hooks: "reelIdeas" must be ≥6. Every "hook" must be scroll-stopping and tied to a named stop or time window from this itinerary; captions should suggest how to shoot it.
- Camera angles: "photoAngles" must be ≥8. Each row must include concrete "angle" (lens / height / POV) and "composition" (rule of thirds, leading lines, foreground frame, etc.).
- Best time for lighting: every "instagramSpots"."bestTime" must name a real lighting window for THAT place (golden hour, blue hour, open shade window, when backlight hits a facade, etc.). Every "photoAngles"."lighting" must echo the best time + direction of light when relevant.
- Cross-link: where possible, reference which day or stop matches each reel, spot, or angle.
`
        : `
NORMAL PLAN MODE (itinerary-first):
- Prioritize a realistic day-by-day schedule, travelLegs, mapsLink accuracy, and budgetBreakdown.
- CONTENT KIT (secondary, shorter): "reelIdeas" ≥3, "instagramSpots" ≥3, "photoAngles" ≥4 — still specific and tied to named places; avoid fluff padding.
`;

    const prompt = `
You are a senior destination specialist (India + worldwide). Your output must read like a paid concierge brief: hyper-specific, navigable in the real world, and impossible to mistake for generic AI filler.

Destination: ${dest}
Budget (INR or local context): ${body.budget}
Trip length: ${body.days} days
Travel style: ${body.style}
Interests: ${body.interests.join(", ")}
Plan mode: ${planMode === "creator" ? "Creator (Instagram-forward)" : "Normal (trip-first)"}
${modeBlock}

ANTI-GENERIC RULES (critical):
- Do NOT use vague filler: no "explore the local culture", "enjoy the scenery", "famous landmark", "authentic experience" without naming WHAT/WHERE/WHEN/WHY.
- Every "activity" must name a concrete action + venue/area (e.g. "Thali lunch at ___", "Sunset from ___ ridge", not "Visit old town").
- Every "localInsight" (required on at least half of all stops) must be a hyper-specific nugget: named stall, dish, neighborhood habit, price reality, or local nickname — NOT advice that applies to any city.

QUALITY BAR (+perceived quality — follow strictly):
1) EXACT TIMINGS: Every stop must have precise "time" (start) AND "timeSlot" (full block). timeSlot must encode real duration (e.g. "9:15–10:40 AM"), not vague "morning". Activities must be schedulable back-to-back with travel legs — no overlapping impossible blocks.
2) TRAVEL DISTANCE + TIME: Every "travelLeg" MUST include BOTH "duration" (total time, e.g. "~28 min") AND "distance" (approximate, e.g. "~4.2 km by road" or "~850 m walk"). Use realistic pairs for the mode.
3) LOCAL TIPS (crowd + best time): Every "localTip" MUST weave in practical specifics for THIS stop: how to avoid crowds OR quieter windows (e.g. "before 10:30 queues are short"), AND best time to visit or order when relevant. Never generic "arrive early" without a concrete window or entrance.
4) TWO HIDDEN PLACES PER DAY: Each day MUST mark exactly two different schedule stops with "hiddenGem": true (real lesser-known spots — not the same famous icon twice). Other stops "hiddenGem": false. If a day has fewer than 2 stops total, mark all that apply as hidden gems and note in narrative — prefer adding enough stops so two hidden gems are possible.
5) ESTIMATED COST PER DAY: Each day object MUST include "estimatedDayCost": one line totaling that day's activities, entries, meals, and local transport (exclude whole-trip hotel unless it's a single-day or you state it clearly), e.g. "₹2,400–2,800 for day (meals + entries + local hops)".

TIME SLOTS:
- "time" = exact start time (e.g. "9:15 AM") for ordering.
- "timeSlot" = full inclusive block (REQUIRED on every stop), e.g. "9:15–10:45 AM". Duration inside timeSlot must match the activity type (meal ~45–75 min, major sight ~60–120 min, quick stop ~20–45 min).

COSTS (per activity):
- "estimatedCost" must prefer EXACT or near-exact numbers: "₹220 for two", "₹50 entry", "₹35 thali", "Free". Tight ranges only when necessary and say what they cover.

TRAVEL ROUTES (every leg — all fields mandatory except note when N/A):
- Each "travelLeg" MUST include:
  - "duration" — total time for the leg (required).
  - "distance" — approximate distance for this leg (required), e.g. "~3.1 km" or "~700 m walk".
  - "mode" (Walk / Metro / Bus / Auto-rickshaw / Taxi / Ferry / Train as appropriate),
  - "route" = CONCRETE navigation: named roads, metro lines + stations, bus numbers, or landmark-to-landmark walking path.
  - "legCost" = fare for THIS leg only (e.g. "₹20 ×2", "₹180 Uber", "₹0 walking").
  - "note" = traffic, crowd, or time risk (specific hours).

Maps:
- Every stop "mapsLink": full https://www.google.com/maps/ URL.
${
  planMode === "creator"
    ? `- CONTENT KIT (Creator thresholds — do not go below):
  - "reelIdeas": ≥6; hooks tied to named stops / times on this trip.
  - "instagramSpots": ≥8; "photoAngles": ≥8; tie to real places, light, and camera intent.`
    : `- CONTENT KIT (Normal thresholds):
  - "reelIdeas": ≥3; "instagramSpots": ≥3; "photoAngles": ≥4 — concise but specific.`
}

Return ONLY valid JSON with this exact shape:
{
  "dayWisePlan": [
    {
      "day": 1,
      "title": "Short catchy day title",
      "estimatedDayCost": "₹X–Y total this day (meals + entries + local transport — see rules)",
      "schedule": [
        {
          "time": "9:00 AM",
          "timeSlot": "9:00–10:30 AM",
          "activity": "Concrete action + named place",
          "place": "Venue or area — specific",
          "estimatedCost": "₹exact or tight + what it covers",
          "localTip": "Crowd + best-time specifics for THIS place (required)",
          "localInsight": "Hyper-specific nugget",
          "mapsLink": "https://www.google.com/maps/...",
          "hiddenGem": false
        }
      ],
      "travelLegs": [
        {
          "fromPlace": "Exact name",
          "toPlace": "Exact name",
          "duration": "~22 min total",
          "distance": "~3.2 km",
          "mode": "Metro",
          "route": "Named lines/stations/roads/exits — navigable detail",
          "legCost": "₹… or Free",
          "note": "Traffic/crowd/time caveat"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "stay": "string",
    "food": "string",
    "transport": "string"
  },
  "reelIdeas": [
    {
      "hook": "string",
      "script": "5–10 shot beats or lines to say on camera (specific to this place)",
      "caption": "string",
      "hashtags": ["#one", "#two"]
    }
  ],
  "instagramSpots": [
    {
      "place": "Specific place name",
      "whyItWorks": "Why it pops on the feed",
      "bestTime": "Best light / time window",
      "shotIdea": "One actionable shot",
      "mapsLink": "https://www.google.com/maps/..."
    }
  ],
  "photoAngles": [
    {
      "spot": "Where to stand",
      "angle": "Camera angle / lens feel",
      "composition": "How to frame",
      "lighting": "Light & time"
    }
  ],
  "blogContent": {
    "title": "string",
    "preview": "string",
    "seoSections": [
      { "heading": "H2-style section title", "body": "2–4 sentences with keywords" }
    ]
  }
}

Rules: travelLegs length must equal schedule.length - 1 (use empty array if only one stop). Include instagramSpots and photoAngles arrays (never omit). Every schedule item MUST include "timeSlot". Every travelLeg MUST include "distance", "route", and "legCost" (use "₹0" or "Free" if walking). Each day MUST have "estimatedDayCost" and exactly two stops with "hiddenGem": true when schedule length ≥ 2. Every "reelIdeas" item MUST include a non-empty "script" (shot list / beat sheet). "blogContent.seoSections" MUST include 3–5 H2-style sections with keyword-rich body copy. No markdown outside JSON.
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
                ? "You are a senior travel concierge and viral content strategist. Output only valid JSON. Every day must include exact timings, leg distances + times, two hidden gems, estimated day cost, and crowd/best-time tips — plus photo/reel content. Reject vague travel-blog language."
                : "You are a senior travel concierge. Output only valid JSON. Every day must include exact timings, leg distances + times, two hidden gems per day, estimated day cost, and actionable local tips. Reject generic travel-blog language. Include a lighter but still useful content kit.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.48,
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
