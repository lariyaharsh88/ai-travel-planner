import HomeMotionGrid from "@/components/HomeMotionGrid";
import HeroSection from "@/components/HeroSection";
import HowItWorksIntro from "@/components/HowItWorksIntro";
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
        <HomeMotionGrid
          hero={<HeroSection />}
          sidebar={
            <section
              id="how-it-works"
              aria-labelledby="how-it-works-heading"
              className="flex min-h-0 flex-col space-y-4"
            >
              <HowItWorksIntro />
              <PlannerShell />
            </section>
          }
        />
      </div>
    </main>
  );
}
