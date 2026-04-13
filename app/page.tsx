import HomeHero from "@/components/HomeHero";
import IndiaExploreSection from "@/components/IndiaExploreSection";
import TravelHeroArt from "@/components/TravelHeroArt";
import TravelPlanningForm from "@/components/TravelPlanningForm";
import TravelSideGraphics from "@/components/TravelSideGraphics";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 surface-hero noise-overlay" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          {/* Left: copy, graphics, India — fills width on mobile */}
          <aside className="space-y-5 lg:sticky lg:top-8 lg:col-span-5 lg:space-y-6">
            <HomeHero />

            <div className="flex justify-center lg:hidden" aria-hidden>
              <TravelHeroArt className="mb-2" />
            </div>

            <div className="hidden lg:block">
              <TravelSideGraphics />
            </div>

            <IndiaExploreSection />
          </aside>

          {/* Right: form + results */}
          <section className="mt-8 lg:col-span-7 lg:mt-0">
            <TravelPlanningForm />
          </section>
        </div>
      </div>
    </main>
  );
}
