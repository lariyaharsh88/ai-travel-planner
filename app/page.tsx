import HeroSection from "@/components/HeroSection";
import PlannerShell from "@/components/planner/PlannerShell";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen overflow-x-hidden bg-[#faf8f4] outline-none"
    >
      <div className="pointer-events-none fixed inset-0 z-0 noise-overlay opacity-[0.55]" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-3 sm:px-6 sm:pb-16 sm:pt-4 lg:pb-12 lg:pt-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          {/* Left: hero stretches to match form column height on large screens */}
          <div className="flex min-h-0 flex-col self-stretch lg:col-span-5">
            <HeroSection />
          </div>

          <section
            id="how-it-works"
            aria-labelledby="how-it-works-heading"
            className="flex min-h-0 flex-col space-y-4 self-stretch lg:col-span-7"
          >
            <div className="max-w-xl">
              <h2
                id="how-it-works-heading"
                className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl"
              >
                How it works
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
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
