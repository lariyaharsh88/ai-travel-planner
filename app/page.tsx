import IndiaExploreSection from "@/components/IndiaExploreSection";
import TravelHeroArt from "@/components/TravelHeroArt";
import TravelPlanningForm from "@/components/TravelPlanningForm";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 surface-hero noise-overlay" aria-hidden />
      <div className="relative mx-auto flex max-w-5xl flex-col px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
        <header className="mb-6 text-center sm:mb-7">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#0c1829]/10 bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1e3a5f] shadow-sm backdrop-blur-sm sm:text-xs">
            <span className="text-[#c9a227]" aria-hidden>
              ◆
            </span>
            Curated by AI
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight tracking-tight text-[#0c1829] sm:text-4xl md:text-5xl">
            <span className="text-gradient-brand">AI Travel Planner</span>
          </h1>
          <TravelHeroArt />
          <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-[#3d4f66] sm:text-base">
            Itinerary, budget, reels, blog draft, and your places on a map—fast.
          </p>
        </header>

        <div className="mx-auto mb-6 w-full max-w-3xl sm:mb-7">
          <IndiaExploreSection />
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <TravelPlanningForm />
        </div>
      </div>
    </main>
  );
}
