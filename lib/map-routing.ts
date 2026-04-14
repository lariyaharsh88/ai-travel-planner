/**
 * Road-following path via OSRM public demo (browser-safe; falls back to straight lines on failure).
 * https://project-osrm.org/
 */

export type LatLng = [number, number];

export async function fetchOsrmRoadPath(points: LatLng[]): Promise<LatLng[] | null> {
  if (points.length < 2) return null;

  const coordStr = points.map(([lat, lon]) => `${lon},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      code?: string;
      routes?: Array<{ geometry?: { type?: string; coordinates?: number[][] } }>;
    };

    if (data.code && data.code !== "Ok") return null;

    const coords = data.routes?.[0]?.geometry?.coordinates;
    if (!coords?.length) return null;

    return coords.map((c) => [c[1], c[0]] as LatLng);
  } catch {
    return null;
  }
}
