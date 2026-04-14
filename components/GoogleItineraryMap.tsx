"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GoogleMap, InfoWindow, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, MapPin } from "lucide-react";
import { googleMapsDirectionsUrl } from "@/lib/google-maps-links";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";
import { mapsSearchUrlForPlace, type MapRoutePoint } from "@/lib/travel-plan";
import type { ItineraryMapProps } from "@/components/LeafletItineraryMap";

const MAP_CONTAINER_CLASS =
  "h-[min(22rem,70vh)] min-h-[352px] w-full sm:h-[26rem] sm:min-h-[416px]";

const DAY_COLORS = [
  "#c2410c",
  "#2563eb",
  "#059669",
  "#b45309",
  "#7c3aed",
  "#db2777",
  "#0d9488",
] as const;

type GStop = MapRoutePoint & {
  lat: number;
  lng: number;
  stopIndex: number;
};

type DayRouteData = {
  path: google.maps.LatLngLiteral[];
  legs: Array<{
    distanceText: string;
    durationText: string;
    startAddress: string;
    endAddress: string;
  }>;
};

function jitterGoogleStops(stops: GStop[]): GStop[] {
  const counts = new Map<string, number>();
  return stops.map((stop) => {
    const key = `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`;
    const n = counts.get(key) ?? 0;
    counts.set(key, n + 1);
    if (n === 0) return stop;

    const angle = (n * 2.399963229728653) % (Math.PI * 2);
    const meters = 22 * n;
    const dLat = (meters / 111_320) * Math.cos(angle);
    const dLng =
      meters / (111_320 * Math.max(0.2, Math.cos((stop.lat * Math.PI) / 180))) * Math.sin(angle);

    return { ...stop, lat: stop.lat + dLat, lng: stop.lng + dLng };
  });
}

const defaultCenter: google.maps.LatLngLiteral = { lat: 20.5937, lng: 78.9629 };

export default function GoogleItineraryMap({ route, destination }: ItineraryMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "epic-india-maps",
    googleMapsApiKey: apiKey,
  });

  const [coordByPlace, setCoordByPlace] = useState<Map<string, google.maps.LatLngLiteral>>(
    new Map(),
  );
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(true);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [dayRoutes, setDayRoutes] = useState<Map<number, DayRouteData>>(new Map());
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [infoStop, setInfoStop] = useState<GStop | null>(null);

  const dest = destination.trim();
  const uniquePlaces = useMemo(
    () => Array.from(new Set(route.map((r) => r.place.trim()).filter(Boolean))),
    [route],
  );

  const dayNumbers = useMemo(() => {
    const s = new Set<number>();
    route.forEach((r) => s.add(r.day));
    return Array.from(s).sort((a, b) => a - b);
  }, [route]);

  useEffect(() => {
    if (uniquePlaces.length === 0) {
      setCoordByPlace(new Map());
      setGeocodeLoading(false);
      return;
    }

    let cancelled = false;
    setGeocodeLoading(true);
    setGeocodeError(null);

    void (async () => {
      try {
        const res = await fetch("/api/maps/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ places: uniquePlaces, region: dest }),
        });
        const data = (await res.json()) as {
          error?: string;
          results?: Record<string, { lat: number; lng: number } | null>;
        };
        if (!res.ok) {
          throw new Error(data.error ?? "Geocoding failed");
        }
        const next = new Map<string, google.maps.LatLngLiteral>();
        if (data.results) {
          for (const [place, pt] of Object.entries(data.results)) {
            if (pt && Number.isFinite(pt.lat) && Number.isFinite(pt.lng)) {
              next.set(place, { lat: pt.lat, lng: pt.lng });
            }
          }
        }
        if (!cancelled) {
          setCoordByPlace(next);
          if (next.size === 0) {
            setGeocodeError("Could not resolve addresses. Check API key and billing.");
          }
        }
      } catch (e) {
        if (!cancelled) {
          setGeocodeError(e instanceof Error ? e.message : "Geocoding failed");
        }
      } finally {
        if (!cancelled) setGeocodeLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uniquePlaces, dest]);

  const stopsRaw: GStop[] = useMemo(() => {
    const out: GStop[] = [];
    route.forEach((point, i) => {
      const c = coordByPlace.get(point.place);
      if (!c) return;
      out.push({
        ...point,
        lat: c.lat,
        lng: c.lng,
        stopIndex: i + 1,
      });
    });
    return out;
  }, [route, coordByPlace]);

  const stops = useMemo(() => jitterGoogleStops(stopsRaw), [stopsRaw]);

  const stopsByDay = useMemo(() => {
    const m = new Map<number, GStop[]>();
    for (const s of stops) {
      const arr = m.get(s.day) ?? [];
      arr.push(s);
      m.set(s.day, arr);
    }
    return m;
  }, [stops]);

  useEffect(() => {
    if (stops.length === 0 || coordByPlace.size === 0) {
      setDayRoutes(new Map());
      return;
    }

    let cancelled = false;
    setDirectionsLoading(true);
    setDayRoutes(new Map());

    void (async () => {
      const next = new Map<number, DayRouteData>();
      const tasks: Promise<void>[] = [];

      for (const day of dayNumbers) {
        const dayStops = stopsByDay.get(day);
        if (!dayStops || dayStops.length < 2) continue;

        const points = dayStops.map((s) => ({ lat: s.lat, lng: s.lng }));
        tasks.push(
          (async () => {
            const res = await fetch("/api/maps/directions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ points }),
            });
            const data = (await res.json()) as {
              path?: google.maps.LatLngLiteral[];
              legs?: DayRouteData["legs"];
              error?: string;
            };
            if (res.ok && data.path && data.path.length >= 2) {
              next.set(day, {
                path: data.path,
                legs: data.legs ?? [],
              });
            }
          })(),
        );
      }

      await Promise.all(tasks);
      if (!cancelled) {
        setDayRoutes(next);
        setDirectionsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stops, coordByPlace.size, dayNumbers, stopsByDay]);

  const boundsPoints = useMemo(() => {
    if (selectedDay === "all") return stops.map((s) => ({ lat: s.lat, lng: s.lng }));
    const list = stops.filter((s) => s.day === selectedDay);
    return list.map((s) => ({ lat: s.lat, lng: s.lng }));
  }, [stops, selectedDay]);

  const fitBounds = useCallback(() => {
    if (!map || typeof google === "undefined" || boundsPoints.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    boundsPoints.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 56);
  }, [map, boundsPoints]);

  useEffect(() => {
    fitBounds();
  }, [fitBounds]);

  useEffect(() => {
    setInfoStop(null);
  }, [selectedDay]);

  const mapOptions = useMemo(
    (): google.maps.MapOptions => ({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      minZoom: 3,
      gestureHandling: "greedy",
    }),
    [],
  );

  const fullTripPoints = useMemo(
    () => stopsRaw.map((s) => ({ lat: s.lat, lng: s.lng })),
    [stopsRaw],
  );

  const googleTripUrl =
    fullTripPoints.length > 0 ? googleMapsDirectionsUrl(fullTripPoints) : null;

  const legsForPanel = useMemo(() => {
    if (selectedDay === "all") {
      const rows: { day: number; leg: number; text: string }[] = [];
      for (const day of dayNumbers) {
        const dr = dayRoutes.get(day);
        if (!dr) continue;
        dr.legs.forEach((leg, i) => {
          rows.push({
            day,
            leg: i + 1,
            text: `${leg.distanceText} · ${leg.durationText}`,
          });
        });
      }
      return rows;
    }
    const dr = dayRoutes.get(selectedDay);
    if (!dr) return [];
    return dr.legs.map((leg, i) => ({
      day: selectedDay,
      leg: i + 1,
      text: `${leg.distanceText} · ${leg.durationText}`,
    }));
  }, [dayRoutes, selectedDay, dayNumbers]);

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-8 text-center text-sm text-red-800">
        Google Maps failed to load. Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and Maps JavaScript API.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-stone-200/80 bg-stone-50 ${MAP_CONTAINER_CLASS}`}
      >
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="h-8 w-8 animate-spin text-[#c2410c]" aria-hidden />
          <p className="text-sm">Loading Google Maps…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-inner">
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/50 px-3 py-2.5 sm:px-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-400">
          Day
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedDay("all")}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
              selectedDay === "all"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
            }`}
          >
            All days
          </button>
          {dayNumbers.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                selectedDay === d
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0.92 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_APPLE_SOFT }}
        className="relative"
      >
        <GoogleMap
          mapContainerClassName={MAP_CONTAINER_CLASS}
          center={defaultCenter}
          zoom={5}
          onLoad={(m) => setMap(m)}
          options={mapOptions}
        >
          {Array.from(dayRoutes.entries()).map(([day, { path }]) => {
            const color = DAY_COLORS[(day - 1) % DAY_COLORS.length];
            const isCurrent = selectedDay === day;
            return (
              <Polyline
                key={`day-route-${day}`}
                path={path}
                options={{
                  strokeColor: color,
                  strokeOpacity:
                    selectedDay === "all" ? 0.78 : isCurrent ? 1 : 0.2,
                  strokeWeight: isCurrent ? 7 : selectedDay === "all" ? 5 : 3,
                  zIndex: isCurrent ? 3 : 1,
                }}
              />
            );
          })}

          {stops.map((stop) => {
            const showMarker = selectedDay === "all" || selectedDay === stop.day;
            if (!showMarker) return null;
            return (
              <Marker
                key={`m-${stop.stopIndex}-${stop.place}-${stop.day}`}
                position={{ lat: stop.lat, lng: stop.lng }}
                onClick={() => setInfoStop(stop)}
                label={{
                  text: String(stop.stopIndex),
                  color: "#1c1917",
                  fontSize: "11px",
                  fontWeight: "600",
                }}
              />
            );
          })}

          {infoStop ? (
            <InfoWindow
              position={{ lat: infoStop.lat, lng: infoStop.lng }}
              onCloseClick={() => setInfoStop(null)}
            >
              <div className="max-w-[220px] text-stone-900">
                <p className="text-xs font-semibold">
                  Stop {infoStop.stopIndex} · Day {infoStop.day}
                </p>
                <p className="text-[11px] text-stone-500">{infoStop.time}</p>
                <p className="mt-1 text-sm">{infoStop.activity}</p>
                <p className="mt-1 text-[11px] text-stone-600">{infoStop.place}</p>
                <a
                  href={mapsSearchUrlForPlace(infoStop.place, dest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#c2410c] hover:underline"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden />
                  Open in Google Maps
                </a>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>

        {geocodeLoading ? (
          <div
            className={`absolute inset-0 z-[1] flex items-center justify-center bg-white/75 backdrop-blur-[2px] ${MAP_CONTAINER_CLASS}`}
          >
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Loader2 className="h-5 w-5 animate-spin text-[#c2410c]" aria-hidden />
              Geocoding places…
            </div>
          </div>
        ) : null}
      </motion.div>

      <div className="space-y-2 border-t border-stone-100 bg-white px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {googleTripUrl ? (
            <a
              href={googleTripUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#c2410c] shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              Open full route in Google Maps
            </a>
          ) : null}
          {directionsLoading ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Building routes…
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">
              Roads from Google Directions · tap a pin for “Open in Google Maps”
            </span>
          )}
        </div>

        {geocodeError ? (
          <p className="text-xs text-red-700">{geocodeError}</p>
        ) : null}
        {!geocodeLoading && route.length > 0 && stopsRaw.length < route.length ? (
          <p className="text-xs text-amber-800">
            Showing {stopsRaw.length} of {route.length} stops (some addresses could not be geocoded).
          </p>
        ) : null}

        {legsForPanel.length > 0 ? (
          <div className="rounded-xl border border-stone-100 bg-stone-50/50 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
              {selectedDay === "all" ? "Travel legs (all days)" : `Day ${selectedDay} · legs`}
            </p>
            <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-[11px] text-stone-600 sm:max-h-40">
              {legsForPanel.map((row, i) => (
                <li key={`${row.day}-${row.leg}-${i}`} className="flex gap-2">
                  <span className="shrink-0 font-medium text-stone-500">
                    D{row.day}·{row.leg}
                  </span>
                  <span>{row.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
