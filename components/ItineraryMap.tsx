"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useMap } from "react-leaflet";
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

type ItineraryMapProps = {
  route: MapRoutePoint[];
};

type Coordinate = {
  place: string;
  lat: number;
  lon: number;
};

type GeocodedStop = MapRoutePoint & {
  lat: number;
  lon: number;
  /** 1-based index in the full itinerary (matches your plan order) */
  stopIndex: number;
};

const defaultCenter: [number, number] = [20, 78];

const ROUTE_COLOR = "#FF6B35";

function makeNumberedIcon(stopIndex: number) {
  return L.divIcon({
    className: "itinerary-map-pin",
    html: `<div class="itinerary-map-pin-inner">${stopIndex}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [52, 52], maxZoom: 14 });
  }, [map, positions]);

  return null;
}

export default function ItineraryMap({ route }: ItineraryMapProps) {
  const [placeToCoord, setPlaceToCoord] = useState<Map<string, Coordinate>>(new Map());
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);

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
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`;
            const response = await fetch(url, {
              headers: {
                Accept: "application/json",
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
          if (
            item !== null &&
            Number.isFinite(item.lat) &&
            Number.isFinite(item.lon)
          ) {
            next.set(item.place, item);
          }
        }

        if (!active) return;
        setPlaceToCoord(next);

        if (next.size === 0) {
          setMapError("Could not map places right now. Please try again.");
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
  }, [uniquePlaces]);

  const { linePositions, stops } = useMemo(() => {
    const line: [number, number][] = [];
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
      stops: resolved,
    };
  }, [route, placeToCoord]);

  const center: [number, number] =
    linePositions.length > 0 ? linePositions[0] : defaultCenter;

  const zoom = route.length === 0 ? 3 : linePositions.length > 0 ? 5 : 3;

  const showRoute = linePositions.length >= 2;

  return (
    <div className="overflow-hidden rounded-xl border border-[#0c1829]/12 shadow-inner">
      <div className="h-52 w-full sm:h-60 [&_.leaflet-control-zoom]:border-[#0c1829]/15">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {linePositions.length > 0 ? <FitBounds positions={linePositions} /> : null}
          {showRoute ? (
            <Polyline
              positions={linePositions}
              pathOptions={{
                color: ROUTE_COLOR,
                weight: 4,
                opacity: 0.88,
                lineJoin: "round",
                lineCap: "round",
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

      {isLoadingMap ? <p className="px-3 py-2 text-sm text-[#64748b]">Loading map…</p> : null}
      {mapError ? <p className="px-3 py-2 text-sm text-red-700">{mapError}</p> : null}
      {!isLoadingMap && !mapError && route.length > 0 && stops.length < route.length ? (
        <p className="px-3 py-2 text-xs text-amber-800">
          Some stops could not be located; showing {stops.length} of {route.length} pins.
        </p>
      ) : null}
    </div>
  );
}
