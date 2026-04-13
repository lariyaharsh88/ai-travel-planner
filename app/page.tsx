import HomeHero from "@/components/HomeHero";
import IndiaExploreSection from "@/components/IndiaExploreSection";
import TravelPlanningForm from "@/components/TravelPlanningForm";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 surface-hero noise-overlay" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:py-8">
        <section className="rounded-3xl border border-[#0c1829]/10 bg-white/75 p-4 shadow-[0_18px_50px_-22px_rgba(12,24,41,0.16)] backdrop-blur-md sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
            <aside className="space-y-4 lg:col-span-5">
              <HomeHero />
              <IndiaExploreSection />
            </aside>

            <section className="lg:col-span-7">
              <TravelPlanningForm />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
