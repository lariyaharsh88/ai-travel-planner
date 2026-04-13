import HeroSection from "@/components/HeroSection";
import PlannerShell from "@/components/planner/PlannerShell";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#faf8f4]">
      <div className="pointer-events-none fixed inset-0 z-0 noise-overlay opacity-[0.55]" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-3 sm:px-6 sm:pb-16 sm:pt-4 lg:pb-12 lg:pt-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="lg:col-span-5">
            <HeroSection />
          </div>

          <section id="how-it-works" className="space-y-4 lg:col-span-7">
            <div className="max-w-xl lg:pt-0">
              <h2 className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
                How it works
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                Share destination, budget, and vibe — we return a day-wise plan, map pins, spend notes, reels, and a
                blog draft.
              </p>
            </div>
            <PlannerShell />
          </section>
        </div>
      </div>
    </main>
  );
}
