import polyline from "@mapbox/polyline";

export type LatLngPoint = { lat: number; lng: number };

/** Decode Google Directions `overview_polyline` into lat/lng points for the map. */
export function decodeGooglePolyline(encoded: string): LatLngPoint[] {
  const pairs = polyline.decode(encoded);
  return pairs.map(([lat, lng]) => ({ lat, lng }));
}
