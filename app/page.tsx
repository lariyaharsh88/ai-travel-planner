import CreatorHookStrip from "@/components/CreatorHookStrip";
import HomeMotionGrid from "@/components/HomeMotionGrid";
import HeroSection from "@/components/HeroSection";
import HowItWorksIntro from "@/components/HowItWorksIntro";
import PageEnter from "@/components/PageEnter";
import PlannerShell from "@/components/planner/PlannerShell";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen overflow-x-hidden bg-[var(--surface-page)] outline-none"
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,255,255,0.9),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_0%,rgba(250,250,249,0.8),transparent_45%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 z-0 noise-overlay opacity-[0.22]" aria-hidden />
      <PageEnter className="relative z-10 mx-auto max-w-6xl px-5 pb-32 pt-6 sm:px-8 sm:pb-24 sm:pt-8 lg:max-w-[72rem] lg:pb-20 lg:pt-10">
        <HomeMotionGrid
          hero={<HeroSection />}
          sidebar={
            <section
              id="how-it-works"
              aria-labelledby="how-it-works-heading"
              className="flex min-h-0 flex-col space-y-5"
            >
              <HowItWorksIntro />
              <CreatorHookStrip />
              <PlannerShell />
            </section>
          }
        />
      </PageEnter>
    </main>
  );
}
