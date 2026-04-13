import HeroSection from "@/components/HeroSection";
import PlannerShell from "@/components/planner/PlannerShell";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#faf8f4]">
      <div className="pointer-events-none fixed inset-0 z-0 noise-overlay opacity-[0.55]" aria-hidden />
      <div className="relative z-10">
        <HeroSection />
        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6 sm:pb-16 sm:pt-14"
        >
          <div className="mb-10 max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">How it works</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
              Share your destination, budget, and vibe — we craft a day-wise itinerary with map pins, spend
              guidance, reel hooks, and a blog-ready draft.
            </p>
          </div>
          <PlannerShell />
        </section>
      </div>
    </main>
  );
}
