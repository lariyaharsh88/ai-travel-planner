import { NextResponse } from "next/server";
import { fetchUnsplashDestinationPhotos } from "@/lib/unsplash-server";
import type { UnsplashPhoto } from "@/lib/unsplash-types";

const MAX_PLACES = 48;
const BATCH = 6;

type Body = {
  destination?: string;
  places?: string[];
};

function normPlace(place: string): string {
  return place.trim().toLowerCase();
}

function placeSearchQuery(place: string, destination: string): string {
  const p = place.trim();
  const d = destination.trim();
  if (!p) return d;
  if (!d) return p;
  return `${p}, ${d}`;
}

/**
 * Batch geocode-style Unsplash searches per itinerary stop (one landscape photo each).
 * Uses the same cached search helper as /api/unsplash/search.
 */
export async function POST(request: Request) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!accessKey) {
    return NextResponse.json({
      results: {} as Record<string, UnsplashPhoto | null>,
      source: "missing_key" as const,
    });
  }
  const apiKey: string = accessKey;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const destination = typeof body.destination === "string" ? body.destination.trim() : "";
  if (!destination) {
    return NextResponse.json({ error: "destination is required" }, { status: 400 });
  }

  if (!Array.isArray(body.places) || body.places.length === 0) {
    return NextResponse.json({ results: {}, source: "empty" as const });
  }

  const raw = body.places.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const p of raw) {
    const k = normPlace(p);
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(p);
  }

  if (unique.length > MAX_PLACES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PLACES} places per request` },
      { status: 400 },
    );
  }

  const results: Record<string, UnsplashPhoto | null> = {};

  async function one(place: string): Promise<void> {
    const q = placeSearchQuery(place, destination);
    const photos = await fetchUnsplashDestinationPhotos(q, 1, apiKey);
    results[normPlace(place)] = photos[0] ?? null;
  }

  for (let i = 0; i < unique.length; i += BATCH) {
    const chunk = unique.slice(i, i + BATCH);
    await Promise.all(chunk.map((p) => one(p)));
  }

  return NextResponse.json({ results, source: "unsplash" as const });
}
