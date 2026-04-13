"use client";

import { useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdfDocument from "@/components/ItineraryPdfDocument";
import ItineraryMap from "@/components/ItineraryMap";
import { TravelPlanResponse } from "@/lib/travel-plan";

type TravelResultsProps = {
  result: TravelPlanResponse;
};

export default function TravelResults({ result }: TravelResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const itineraryPlaces = useMemo(
    () =>
      Array.from(
        new Set(
          result.dayWisePlan.flatMap((dayPlan) =>
            dayPlan.places.map((place) => place.trim()).filter(Boolean),
          ),
        ),
      ),
    [result.dayWisePlan],
  );

  const handleCopy = async (index: number, hook: string, caption: string, hashtags: string[]) => {
    const content = `${hook}\n\n${caption}\n\n${hashtags.join(" ")}`;
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <section className="w-full max-w-3xl space-y-6 text-left">
      <div className="flex justify-end">
        <PDFDownloadLink
          document={<ItineraryPdfDocument result={result} />}
          fileName="ai-travel-itinerary.pdf"
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-xl font-semibold">Itinerary Map</h2>
        <ItineraryMap places={itineraryPlaces} />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-xl font-semibold">Day-wise Itinerary</h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {result.dayWisePlan.map((dayPlan) => (
            <article key={dayPlan.day} className="rounded-2xl bg-zinc-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-zinc-500">Day {dayPlan.day}</p>
              <h3 className="mt-1 text-lg font-semibold">{dayPlan.title}</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Activities</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                    {dayPlan.activities.map((activity) => (
                      <li key={activity}>{activity}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Places</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                    {dayPlan.places.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-xl font-semibold">Budget Breakdown</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Stay</p>
            <p className="mt-1 font-semibold">{result.budgetBreakdown.stay}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Food</p>
            <p className="mt-1 font-semibold">{result.budgetBreakdown.food}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Transport</p>
            <p className="mt-1 font-semibold">{result.budgetBreakdown.transport}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-xl font-semibold">Reel Ideas</h2>
        <div className="space-y-3">
          {result.reelIdeas.map((idea, index) => (
            <article key={`${idea.hook}-${index}`} className="rounded-xl bg-zinc-50 p-4 shadow-sm">
              <p className="text-sm font-semibold">{idea.hook}</p>
              <p className="mt-2 text-sm text-zinc-700">{idea.caption}</p>
              <p className="mt-2 text-sm text-zinc-500">{idea.hashtags.join(" ")}</p>
              <button
                type="button"
                onClick={() => handleCopy(index, idea.hook, idea.caption, idea.hashtags)}
                className="mt-3 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                {copiedIndex === index ? "Copied" : "Copy"}
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-xl font-semibold">Blog Preview</h2>
        <article className="rounded-xl bg-zinc-50 p-4 shadow-sm">
          <h3 className="text-base font-semibold">{result.blogContent.title}</h3>
          <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700">
            {result.blogContent.preview}
          </div>
        </article>
      </div>
    </section>
  );
}
