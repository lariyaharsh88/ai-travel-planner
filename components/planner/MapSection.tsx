"use client";

import { MapPinned } from "lucide-react";
import ItineraryMap from "@/components/ItineraryMap";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";

type MapSectionProps = {
  places: string[];
};

export default function MapSection({ places }: MapSectionProps) {
  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={6}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:shadow-lg">
          <MapPinned className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">Itinerary map</h3>
          <p className="text-xs text-stone-500">Pins from your day plan (OpenStreetMap)</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-stone-100 shadow-inner transition-shadow duration-500 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <ItineraryMap places={places} />
      </div>
    </PremiumInteractiveCard>
  );
}
