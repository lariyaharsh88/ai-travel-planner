"use client";

import { useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdfDocument from "@/components/ItineraryPdfDocument";
import ItineraryMap from "@/components/ItineraryMap";
import { TravelPlanResponse } from "@/lib/travel-plan";

type TravelResultsProps = {
  result: TravelPlanResponse;
};

const sectionShell =
  "relative overflow-hidden rounded-2xl border border-[#0c1829]/10 bg-white/90 p-4 shadow-[0_14px_36px_-14px_rgba(12,24,41,0.12)] backdrop-blur-sm sm:p-5";

const sectionAccent = (
  <div
    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent"
    aria-hidden
  />
);

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
    <section className="w-full space-y-4 text-left">
      <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#0c1829] sm:text-2xl">
            Your trip
          </h2>
          <p className="mt-0.5 text-xs text-[#64748b] sm:text-sm">Map, itinerary, budget, content.</p>
        </div>
        <PDFDownloadLink
          document={<ItineraryPdfDocument result={result} />}
          fileName="ai-travel-itinerary.pdf"
          className="inline-flex items-center justify-center rounded-lg border border-[#0c1829]/12 bg-white px-4 py-2 text-xs font-semibold text-[#0c1829] shadow-sm transition hover:border-[#c9a227]/35 hover:bg-[#f8f6f3] sm:text-sm"
        >
          {({ loading }) => (loading ? "Preparing PDF…" : "Download PDF")}
        </PDFDownloadLink>
      </div>

      <div className={sectionShell}>
        {sectionAccent}
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829]">
              Itinerary map
            </h3>
          </div>
          <ItineraryMap places={itineraryPlaces} />
        </div>
      </div>

      <div className={sectionShell}>
        {sectionAccent}
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829]">
              Day-by-day itinerary
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {result.dayWisePlan.map((dayPlan) => (
              <article
                key={dayPlan.day}
                className="relative overflow-hidden rounded-xl border border-[#0c1829]/8 bg-gradient-to-br from-[#f8f6f3] to-white p-4 shadow-sm"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-[#1e3a5f] via-[#c9a227] to-[#e8a87c]"
                  aria-hidden
                />
                <p className="pl-3 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a227]">
                  Day {dayPlan.day}
                </p>
                <h4 className="font-[family-name:var(--font-playfair)] mt-1 pl-3 text-lg font-semibold text-[#0c1829]">
                  {dayPlan.title}
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-4 pl-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Activities</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[#334155]">
                      {dayPlan.activities.map((activity) => (
                        <li key={activity} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#c9a227]" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Places</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[#334155]">
                      {dayPlan.places.map((place) => (
                        <li key={place} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#1e3a5f]" />
                          {place}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionShell}>
        {sectionAccent}
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829]">
              Budget breakdown
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                ["Stay", result.budgetBreakdown.stay],
                ["Food", result.budgetBreakdown.food],
                ["Transport", result.budgetBreakdown.transport],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#0c1829]/8 bg-gradient-to-br from-white to-[#f8f6f3] p-3 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">{label}</p>
                <p className="mt-2 font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionShell}>
        {sectionAccent}
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829]">
              Reel ideas
            </h3>
          </div>
          <div className="space-y-3">
            {result.reelIdeas.map((idea, index) => (
              <article
                key={`${idea.hook}-${index}`}
                className="rounded-xl border border-[#0c1829]/8 bg-[#faf8f5] p-4 shadow-sm"
              >
                <p className="font-medium text-[#0c1829]">{idea.hook}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{idea.caption}</p>
                <p className="mt-3 text-sm text-[#94a3b8]">{idea.hashtags.join(" ")}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(index, idea.hook, idea.caption, idea.hashtags)}
                  className="mt-4 rounded-lg bg-[#0c1829] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1e3a5f]"
                >
                  {copiedIndex === index ? "Copied" : "Copy"}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionShell}>
        {sectionAccent}
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#0c1829]">
              Blog preview
            </h3>
          </div>
          <article className="rounded-xl border border-[#0c1829]/8 bg-gradient-to-br from-[#f8f6f3] to-white p-4">
            <h4 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#0c1829] sm:text-lg">
              {result.blogContent.title}
            </h4>
            <div className="mt-3 max-h-44 overflow-y-auto rounded-lg border border-[#0c1829]/10 bg-white/80 p-3 text-xs leading-relaxed text-[#475569] shadow-inner sm:text-sm">
              {result.blogContent.preview}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
