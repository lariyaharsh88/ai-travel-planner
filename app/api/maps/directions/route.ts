import { NextResponse } from "next/server";
import { decodeGooglePolyline } from "@/lib/decode-google-polyline";

type LatLng = { lat: number; lng: number };

type Body = {
  /** Ordered points for one continuous path (min 2). */
  points: LatLng[];
};

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
      { error: "Missing GOOGLE_MAPS_SERVER_KEY or GOOGLE_MAPS_API_KEY for Directions." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.points) || body.points.length < 2) {
    return NextResponse.json(
      { error: "Need at least two points for directions" },
      { status: 400 },
    );
  }

  const pts = body.points.filter(
    (p) =>
      p &&
      typeof p.lat === "number" &&
      typeof p.lng === "number" &&
      Number.isFinite(p.lat) &&
      Number.isFinite(p.lng),
  );
  if (pts.length < 2) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const origin = pts[0];
  const destination = pts[pts.length - 1];
  const middle = pts.slice(1, -1);

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${origin.lat},${origin.lng}`);
  url.searchParams.set("destination", `${destination.lat},${destination.lng}`);
  if (middle.length > 0) {
    if (middle.length > 23) {
      return NextResponse.json(
        { error: "Too many intermediate stops for one Directions request (max 23)" },
        { status: 400 },
      );
    }
    url.searchParams.set("waypoints", middle.map((p) => `${p.lat},${p.lng}`).join("|"));
  }
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url.toString());
    const data = (await res.json()) as {
      status: string;
      error_message?: string;
      routes?: Array<{
        overview_polyline?: { points?: string };
        legs?: Array<{
          distance: { text: string; value: number };
          duration: { text: string; value: number };
          start_address: string;
          end_address: string;
        }>;
      }>;
    };

    if (data.status !== "OK" || !data.routes?.[0]) {
      return NextResponse.json(
        {
          error: "Directions failed",
          status: data.status,
          detail: data.error_message ?? null,
        },
        { status: 502 },
      );
    }

    const route = data.routes[0];
    const encoded = route.overview_polyline?.points;
    const path = encoded ? decodeGooglePolyline(encoded) : pts;

    const legs =
      route.legs?.map((leg) => ({
        distanceMeters: leg.distance.value,
        durationSeconds: leg.duration.value,
        distanceText: leg.distance.text,
        durationText: leg.duration.text,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
      })) ?? [];

    return NextResponse.json({
      path,
      legs,
      source: "google_directions" as const,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
