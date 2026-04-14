"use client";

import dynamic from "next/dynamic";
import type { ItineraryMapProps } from "@/components/LeafletItineraryMap";

const LeafletItineraryMap = dynamic(() => import("@/components/LeafletItineraryMap"), {
  ssr: false,
});

const GoogleItineraryMap = dynamic(() => import("@/components/GoogleItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[min(22rem,70vh)] w-full items-center justify-center rounded-xl border border-stone-200/80 bg-stone-50/50 text-sm text-stone-400">
      Loading map…
    </div>
  ),
});

function hasGoogleMapsKey(): boolean {
  const k = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return typeof k === "string" && k.trim().length > 0;
}

/**
 * Google Maps (geocoding + directions + polylines) when
 * `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set; server routes use
 * `GOOGLE_MAPS_SERVER_KEY` or `GOOGLE_MAPS_API_KEY`.
 * Otherwise Leaflet + OSM + Nominatim + OSRM.
 */
export default function ItineraryMap(props: ItineraryMapProps) {
  if (hasGoogleMapsKey()) {
    return <GoogleItineraryMap {...props} />;
  }
  return <LeafletItineraryMap {...props} />;
}
