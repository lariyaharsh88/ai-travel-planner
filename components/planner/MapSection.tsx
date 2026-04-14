"use client";

import dynamic from "next/dynamic";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import type { MapRoutePoint } from "@/lib/travel-plan";

const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[min(22rem,70vh)] w-full items-center justify-center rounded-2xl border border-stone-100/80 bg-stone-50/50 text-sm text-stone-400">
      Loading map…
    </div>
  ),
});

type MapSectionProps = {
  route: MapRoutePoint[];
  destination: string;
};

export default function MapSection({ route, destination }: MapSectionProps) {
  const n = route.length;
  const summary = n <= 1 ? "One stop" : `${n} stops · ordered route`;

  return (
    <PremiumInteractiveCard className="overflow-hidden p-0 sm:p-0" hoverLift={2}>
      <div className="border-b border-stone-100/80 bg-stone-50/30 px-5 py-3.5 sm:px-6">
        <p className="text-[11px] font-medium tracking-wide text-stone-500">{summary}</p>
      </div>
      <div className="overflow-hidden rounded-b-[1.75rem]">
        <ItineraryMap route={route} destination={destination} />
      </div>
    </PremiumInteractiveCard>
  );
}
