"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

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

type ItineraryMapProps = {
  places: string[];
};

type Coordinate = {
  place: string;
  lat: number;
  lon: number;
};

const defaultCenter: [number, number] = [20, 78];

export default function ItineraryMap({ places }: ItineraryMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);

  const uniquePlaces = useMemo(
    () => Array.from(new Set(places.map((place) => place.trim()).filter(Boolean))),
    [places],
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
      setCoordinates([]);
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

        const validCoordinates = results.filter(
          (item): item is Coordinate =>
            item !== null && Number.isFinite(item.lat) && Number.isFinite(item.lon),
        );

        if (!active) return;
        setCoordinates(validCoordinates);

        if (validCoordinates.length === 0) {
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

  const center: [number, number] =
    coordinates.length > 0 ? [coordinates[0].lat, coordinates[0].lon] : defaultCenter;

  return (
    <div className="overflow-hidden rounded-xl border border-[#0c1829]/12 shadow-inner">
      <div className="h-52 w-full sm:h-60">
        <MapContainer center={center} zoom={coordinates.length > 0 ? 5 : 3} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coordinates.map((coordinate) => (
            <Marker key={`${coordinate.place}-${coordinate.lat}-${coordinate.lon}`} position={[coordinate.lat, coordinate.lon]}>
              <Popup>{coordinate.place}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {isLoadingMap ? <p className="px-3 py-2 text-sm text-[#64748b]">Loading map…</p> : null}
      {mapError ? <p className="px-3 py-2 text-sm text-red-700">{mapError}</p> : null}
    </div>
  );
}
