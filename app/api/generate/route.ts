import { NextResponse } from "next/server";
import {
  type DayPlan,
  type InstagramSpot,
  type PhotoAngle,
  type ReelIdea,
  type ScheduleStop,
  type TravelLeg,
  type TravelPlanResponse,
  mapsSearchUrlForPlace,
} from "@/lib/travel-plan";

type GenerateRequestBody = {
  destination: string;
  budget: number;
  days: number;
  style: string;
  interests: string[];
};

function isValidBody(body: unknown): body is GenerateRequestBody {
  if (!body || typeof body !== "object") return false;

  const candidate = body as Partial<GenerateRequestBody>;
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
    candidate.interests.every((item) => typeof item === "string")
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
    activity: s.activity.trim(),
    place: s.place.trim(),
    estimatedCost: s.estimatedCost.trim(),
    localTip: isNonEmptyString(s.localTip) ? s.localTip.trim() : undefined,
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
    mode: isNonEmptyString(l.mode) ? l.mode.trim() : undefined,
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
    blogContent: parsed.blogContent,
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
    const prompt = `
You are an expert local travel planner for India and worldwide destinations.
Generate a detailed, practical itinerary with REALISTIC structure.

Destination: ${dest}
Budget (INR or local context): ${body.budget}
Trip length: ${body.days} days
Travel style: ${body.style}
Interests: ${body.interests.join(", ")}

Requirements (must follow):
1. Each day has a clear "schedule": ordered stops with EXACT or typical clock times (e.g. "9:00 AM", "1:30 PM", "6:45 PM").
2. Between consecutive stops, include "travelLegs": realistic travel time between places (e.g. "~35 min by metro", "12 min walk"). Same count as stops minus one.
3. For EVERY stop, give "estimatedCost" for that activity (meal entry fee snack) in local currency or INR as appropriate use ranges like "₹0–100" or "Free".
4. Add "localTip" on several stops when useful e.g. crowd timing best light quieter entrance booking note.
5. Include at least one "hiddenGem": true stop per day that is NOT a generic top-5 tourist only list — prefer neighborhood markets local eateries viewpoint lesser-known walks.
6. Every stop MUST have "mapsLink": a full URL starting with https://www.google.com/maps/ — use place URLs or search URLs like https://www.google.com/maps/search/?api=1&query=PlaceName+City
7. CONTENT CREATOR KIT (this is your differentiator):
   - "reelIdeas": at least 4 items. Each needs a punchy hook (first line), caption body, and 4–8 hashtags. Tie hooks to real stops on this trip.
   - "instagramSpots": at least 5 spots that are genuinely photogenic for the feed — mix famous and hidden-gem stops from the itinerary. For each: why it works visually, best light/time, and one concrete shot idea. Optional "mapsLink" when helpful.
   - "photoAngles": at least 6 entries with specific photographer-style direction: exact spot, camera angle/height/lens feel, composition (rule of thirds, leading lines, foreground), and lighting/time. Not generic advice — tie to this destination.

Return ONLY valid JSON with this exact shape:
{
  "dayWisePlan": [
    {
      "day": 1,
      "title": "Short catchy day title",
      "schedule": [
        {
          "time": "9:00 AM",
          "activity": "What to do",
          "place": "Specific venue or area name",
          "estimatedCost": "₹… or Free",
          "localTip": "Optional one line",
          "mapsLink": "https://www.google.com/maps/...",
          "hiddenGem": false
        }
      ],
      "travelLegs": [
        {
          "fromPlace": "Name",
          "toPlace": "Name",
          "duration": "~25 min",
          "mode": "Metro",
          "note": "Optional"
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
    "preview": "string"
  }
}

Rules: travelLegs length must equal schedule.length - 1 (use empty array if only one stop). Include instagramSpots and photoAngles arrays (never omit). No markdown outside JSON.
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
              "You are an expert travel planner and travel-content strategist. You output only valid JSON. Use realistic times, costs, and maps links. Prefer hidden gems. Every plan must include strong reel hooks, Instagram-worthy spot notes, and specific photo angles — not generic social media fluff.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.55,
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
