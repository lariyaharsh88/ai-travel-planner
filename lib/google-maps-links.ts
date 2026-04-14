/**
 * Build Google Maps URLs for search and multi-stop directions.
 */

export type LatLngPoint = { lat: number; lon: number };
/** Google JS API style; normalized to lon in helpers below. */
export type LatLngLiteral = { lat: number; lng: number };

function lonOf(p: LatLngPoint | LatLngLiteral): number {
  return "lon" in p ? p.lon : p.lng;
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

/** Driving directions through an ordered list of coordinates (max ~10 waypoints in practice). */
export function googleMapsDirectionsUrl(points: (LatLngPoint | LatLngLiteral)[]): string | null {
  if (points.length === 0) return null;
  if (points.length === 1) {
    const p = points[0];
    const lon = lonOf(p);
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${lon}`;
  }

  const origin = `${points[0].lat},${lonOf(points[0])}`;
  const destination = `${points[points.length - 1].lat},${lonOf(points[points.length - 1])}`;
  const middle = points.slice(1, -1);
  if (middle.length === 0) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }

  const waypoints = middle.map((p) => `${p.lat},${lonOf(p)}`).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
}
