import { NextResponse } from "next/server";

type Body = {
  places: string[];
  /** Bias search, e.g. trip destination */
  region?: string;
};

const MAX_PLACES = 40;

/** In-memory cache for warm server instances (short TTL via size cap). */
const cache = new Map<string, { lat: number; lng: number }>();
const CACHE_MAX = 500;

function cacheKey(place: string, region: string) {
  return `${place.trim().toLowerCase()}|${region.trim().toLowerCase()}`;
}

function getServerKey(): string | null {
  const k =
    process.env.GOOGLE_MAPS_SERVER_KEY?.trim() ||
    process.env.GOOGLE_MAPS_API_KEY?.trim();
  return k || null;
}

export async function POST(request: Request) {
  const key = getServerKey();
  if (!key) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_SERVER_KEY or GOOGLE_MAPS_API_KEY for Geocoding." },
      { status: 500 },
    );
  }
  const apiKey: string = key;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.places) || body.places.length === 0) {
    return NextResponse.json({ error: "Expected non-empty places array" }, { status: 400 });
  }
  if (body.places.length > MAX_PLACES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PLACES} places per request` },
      { status: 400 },
    );
  }

  const region = typeof body.region === "string" ? body.region.trim() : "";
  const unique = Array.from(new Set(body.places.map((p) => p.trim()).filter(Boolean)));

  const results: Record<string, { lat: number; lng: number } | null> = {};

  async function geocodeOne(place: string): Promise<void> {
    const ck = cacheKey(place, region);
    const hit = cache.get(ck);
    if (hit) {
      results[place] = hit;
      return;
    }

    const address = region ? `${place}, ${region}` : place;
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", address);
    url.searchParams.set("key", apiKey);

    try {
      const res = await fetch(url.toString());
      const data = (await res.json()) as {
        status: string;
        results?: Array<{ geometry: { location: { lat: number; lng: number } } }>;
      };

      if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
        const loc = data.results[0].geometry.location;
        const point = { lat: loc.lat, lng: loc.lng };
        results[place] = point;
        if (cache.size >= CACHE_MAX) cache.clear();
        cache.set(ck, point);
      } else {
        results[place] = null;
      }
    } catch {
      results[place] = null;
    }
  }

  const BATCH = 8;
  for (let i = 0; i < unique.length; i += BATCH) {
    const chunk = unique.slice(i, i + BATCH);
    await Promise.all(chunk.map((p) => geocodeOne(p)));
  }

  return NextResponse.json({ results, source: "google_geocoding" as const });
}
