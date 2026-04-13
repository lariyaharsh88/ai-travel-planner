"use client";

import { useEffect } from "react";
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

export const INDIA_TOP_DESTINATIONS = [
  { name: "Delhi", hint: "Heritage & food", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", hint: "Coast & culture", lat: 19.076, lon: 72.8777 },
  { name: "Jaipur", hint: "Palaces & bazaars", lat: 26.9124, lon: 75.7873 },
  { name: "Goa", hint: "Beaches & vibes", lat: 15.4989, lon: 73.8278 },
  { name: "Kochi", hint: "Backwaters gateway", lat: 9.9312, lon: 76.2673 },
  { name: "Varanasi", hint: "Ghats & rituals", lat: 25.3176, lon: 82.9739 },
  { name: "Agra", hint: "Taj & Mughal lore", lat: 27.1767, lon: 78.0081 },
  { name: "Bengaluru", hint: "Gardens & tech city", lat: 12.9716, lon: 77.5946 },
] as const;

const indiaCenter: [number, number] = [22.5, 79];
const indiaZoom = 4.5;

export default function IndiaExploreSection() {
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

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#0c1829]/10 bg-white/80 p-4 shadow-md backdrop-blur-sm sm:p-5"
      aria-labelledby="india-explore-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#1e3a5f] via-[#c9a227] to-[#138808]/60"
        aria-hidden
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="india-explore-heading"
            className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829] sm:text-xl"
          >
            India at a glance
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-[#64748b] sm:text-sm">
            Tap markers for ideas—then plan your own route below.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5 sm:max-w-[min(100%,22rem)] sm:justify-end">
          {INDIA_TOP_DESTINATIONS.map((d) => (
            <span
              key={d.name}
              className="inline-flex items-center rounded-full border border-[#0c1829]/10 bg-[#f8f6f3] px-2 py-0.5 text-[10px] font-medium text-[#334155] sm:text-xs"
            >
              {d.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-[#0c1829]/10 shadow-inner">
        <div className="h-40 w-full sm:h-44">
          <MapContainer
            center={indiaCenter}
            zoom={indiaZoom}
            minZoom={3}
            maxZoom={8}
            scrollWheelZoom={false}
            className="h-full w-full [&_.leaflet-control-zoom]:border-[#0c1829]/15"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {INDIA_TOP_DESTINATIONS.map((spot) => (
              <Marker key={spot.name} position={[spot.lat, spot.lon]}>
                <Popup>
                  <span className="font-semibold">{spot.name}</span>
                  <br />
                  <span className="text-xs text-neutral-600">{spot.hint}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
