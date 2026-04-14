/**
 * Build Google Maps URLs for search and multi-stop directions.
 */

export type LatLngPoint = { lat: number; lon: number };

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

/** Driving directions through an ordered list of coordinates (max ~10 waypoints in practice). */
export function googleMapsDirectionsUrl(points: LatLngPoint[]): string | null {
  if (points.length === 0) return null;
  if (points.length === 1) {
    const { lat, lon } = points[0];
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  }

  const origin = `${points[0].lat},${points[0].lon}`;
  const destination = `${points[points.length - 1].lat},${points[points.length - 1].lon}`;
  const middle = points.slice(1, -1);
  if (middle.length === 0) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }

  const waypoints = middle.map((p) => `${p.lat},${p.lon}`).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
}
