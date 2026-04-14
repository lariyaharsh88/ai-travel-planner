"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { googleMapsDirectionsUrl } from "@/lib/google-maps-links";
import { fetchOsrmRoadPath, type LatLng } from "@/lib/map-routing";
import type { MapRoutePoint } from "@/lib/travel-plan";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), {
  ssr: false,
});
const ScaleControl = dynamic(() => import("react-leaflet").then((mod) => mod.ScaleControl), {
  ssr: false,
});

export type ItineraryMapProps = {
  route: MapRoutePoint[];
  destination: string;
};

type Coordinate = {
  place: string;
  lat: number;
  lon: number;
};

type GeocodedStop = MapRoutePoint & {
  lat: number;
  lon: number;
  stopIndex: number;
};

const defaultCenter: [number, number] = [20, 78];

const ROUTE_COLOR = "#FF6B35";
const ROUTE_FALLBACK_DASH = "8 10";

const NOMINATIM_UA = "EpicIndiaTrips-Planner/1.0 (https://github.com; travel planner)";

function makeNumberedIcon(stopIndex: number) {
  return L.divIcon({
    className: "itinerary-map-pin",
    html: `<div class="itinerary-map-pin-inner">${stopIndex}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function jitterDuplicatePositions(stops: GeocodedStop[]): GeocodedStop[] {
  const counts = new Map<string, number>();
  return stops.map((stop) => {
    const key = `${stop.lat.toFixed(4)},${stop.lon.toFixed(4)}`;
    const n = counts.get(key) ?? 0;
    counts.set(key, n + 1);
    if (n === 0) return stop;

    const angle = (n * 2.399963229728653) % (Math.PI * 2);
    const meters = 22 * n;
    const dLat = (meters / 111_320) * Math.cos(angle);
    const dLon =
      meters / (111_320 * Math.max(0.2, Math.cos((stop.lat * Math.PI) / 180))) * Math.sin(angle);

    return { ...stop, lat: stop.lat + dLat, lon: stop.lon + dLon };
  });
}

function FitBounds({ positions }: { positions: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [56, 56], maxZoom: 14 });
  }, [map, positions]);

  return null;
}

export default function LeafletItineraryMap({ route, destination }: ItineraryMapProps) {
  const [placeToCoord, setPlaceToCoord] = useState<Map<string, Coordinate>>(new Map());
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [roadPath, setRoadPath] = useState<LatLng[] | null>(null);
  const [roadPathStatus, setRoadPathStatus] = useState<"idle" | "loading" | "ok" | "fallback">("idle");

  const dest = destination.trim();
  const uniquePlaces = useMemo(
    () => Array.from(new Set(route.map((r) => r.place.trim()).filter(Boolean))),
    [route],
  );

  useEffect(() => {
    const configureLeafletIcons = async () => {
      const leaflet = await import("leaflet");
      const iconDefault = leaflet.Icon.Default as typeof leaflet.Icon.Default & {
        prototype: { _getIconUrl?: unknown };
      };

      delete iconDefault.prototype._getIconUrl;
      iconDefault.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    };

    void configureLeafletIcons();
  }, []);

  useEffect(() => {
    if (uniquePlaces.length === 0) {
      setPlaceToCoord(new Map());
      return;
    }

    let active = true;
    setIsLoadingMap(true);
    setMapError(null);

    const geocodePlaces = async () => {
      try {
        const results = await Promise.all(
          uniquePlaces.map(async (place) => {
            const q = dest ? `${place}, ${dest}` : place;
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
            const response = await fetch(url, {
              headers: {
                Accept: "application/json",
                "User-Agent": NOMINATIM_UA,
              },
            });

            if (!response.ok) return null;
            const data = (await response.json()) as Array<{ lat: string; lon: string }>;
            if (!data[0]) return null;

            return {
              place,
              lat: Number(data[0].lat),
              lon: Number(data[0].lon),
            } satisfies Coordinate;
          }),
        );

        const next = new Map<string, Coordinate>();
        for (const item of results) {
          if (item !== null && Number.isFinite(item.lat) && Number.isFinite(item.lon)) {
            next.set(item.place, item);
          }
        }

        if (!active) return;
        setPlaceToCoord(next);

        if (next.size === 0) {
          setMapError("Could not place pins on the map. Try again in a moment.");
        }
      } catch {
        if (!active) return;
        setMapError("Failed to load map coordinates.");
      } finally {
        if (active) setIsLoadingMap(false);
      }
    };

    void geocodePlaces();
    return () => {
      active = false;
    };
  }, [uniquePlaces, dest]);

  const { linePositions, stopsRaw } = useMemo(() => {
    const line: LatLng[] = [];
    const resolved: GeocodedStop[] = [];

    route.forEach((point, i) => {
      const c = placeToCoord.get(point.place);
      if (!c) return;
      line.push([c.lat, c.lon]);
      resolved.push({
        ...point,
        lat: c.lat,
        lon: c.lon,
        stopIndex: i + 1,
      });
    });

    return {
      linePositions: line,
      stopsRaw: resolved,
    };
  }, [route, placeToCoord]);

  const stops = useMemo(() => jitterDuplicatePositions(stopsRaw), [stopsRaw]);

  useEffect(() => {
    if (linePositions.length < 2) {
      setRoadPath(null);
      setRoadPathStatus("idle");
      return;
    }

    let cancelled = false;
    setRoadPathStatus("loading");
    setRoadPath(null);

    void (async () => {
      const path = await fetchOsrmRoadPath(linePositions);
      if (cancelled) return;
      if (path && path.length >= 2) {
        setRoadPath(path);
        setRoadPathStatus("ok");
      } else {
        setRoadPath(null);
        setRoadPathStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [linePositions]);

  const pathToShow = roadPath && roadPath.length >= 2 ? roadPath : linePositions;
  const showSolidRoute = pathToShow.length >= 2;
  const showFallbackStraight =
    roadPathStatus === "fallback" && linePositions.length >= 2 && pathToShow === linePositions;

  const boundsPositions = useMemo(() => {
    if (pathToShow.length >= 2) return pathToShow;
    return linePositions;
  }, [pathToShow, linePositions]);

  const center: [number, number] =
    linePositions.length > 0 ? linePositions[0] : defaultCenter;

  const zoom = route.length === 0 ? 3 : linePositions.length > 0 ? 5 : 3;

  const googleDirectionsUrl =
    linePositions.length > 0
      ? googleMapsDirectionsUrl(linePositions.map(([lat, lon]) => ({ lat, lon })))
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/80 shadow-inner">
      <div className="h-[min(22rem,70vh)] min-h-[352px] w-full sm:h-[26rem] sm:min-h-[416px] [&_.leaflet-control-zoom]:border-stone-200/80">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Routing <a href="https://project-osrm.org/">OSRM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ScaleControl position="bottomleft" metric imperial={false} />
          {boundsPositions.length > 0 ? <FitBounds positions={boundsPositions} /> : null}

          {showSolidRoute ? (
            <Polyline
              positions={pathToShow}
              pathOptions={{
                color: ROUTE_COLOR,
                weight: 5,
                opacity: roadPathStatus === "ok" ? 0.92 : 0.85,
                lineJoin: "round",
                lineCap: "round",
                dashArray: showFallbackStraight ? ROUTE_FALLBACK_DASH : undefined,
              }}
            />
          ) : null}

          {stops.map((stop) => (
            <Marker
              key={`stop-${stop.stopIndex}-${stop.place}`}
              position={[stop.lat, stop.lon]}
              icon={makeNumberedIcon(stop.stopIndex)}
            >
              <Popup>
                <div className="min-w-[200px] text-sm">
                  <p className="font-semibold text-stone-900">
                    Stop {stop.stopIndex} · Day {stop.day}
                  </p>
                  <p className="text-xs text-stone-500">{stop.time}</p>
                  <p className="mt-1 text-stone-800">{stop.activity}</p>
                  <p className="mt-1 text-xs text-stone-600">{stop.place}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-col gap-2 border-t border-stone-100/90 bg-white px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
        {googleDirectionsUrl && linePositions.length >= 1 ? (
          <a
            href={googleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#c2410c] shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
          >
            Open route in Google Maps
          </a>
        ) : null}
        {isLoadingMap ? <p className="text-sm text-stone-500">Placing pins…</p> : null}
        {mapError ? <p className="text-sm text-red-700">{mapError}</p> : null}
        {!isLoadingMap && !mapError && route.length > 0 && stopsRaw.length < route.length ? (
          <p className="text-xs text-amber-800">
            Some stops could not be geocoded; showing {stopsRaw.length} of {route.length} pins.
          </p>
        ) : null}
        {!isLoadingMap && !mapError && linePositions.length >= 2 ? (
          <p className="text-[11px] text-stone-500">
            {roadPathStatus === "loading"
              ? "Drawing road route…"
              : roadPathStatus === "ok"
                ? "Route follows roads between stops (OSRM)."
                : roadPathStatus === "fallback"
                  ? "Straight-line path — road routing unavailable for this path."
                  : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
