import CreatorHookStrip from "@/components/CreatorHookStrip";
import HomeMotionGrid from "@/components/HomeMotionGrid";
import HomeSidebarLayout from "@/components/HomeSidebarLayout";
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
      <div className="pointer-events-none fixed inset-0 z-0 noise-overlay opacity-[0.12]" aria-hidden />
      <PageEnter className="relative z-10 mx-auto max-w-6xl px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] pt-5 sm:px-8 sm:pb-28 sm:pt-10 lg:max-w-[72rem] lg:pb-24 lg:pt-11">
        <HomeMotionGrid
          hero={<HeroSection />}
          sidebar={
            <section id="how-it-works" aria-labelledby="how-it-works-heading" className="min-h-0">
              <HomeSidebarLayout>
                <HowItWorksIntro />
                <CreatorHookStrip />
                <PlannerShell />
              </HomeSidebarLayout>
            </section>
          }
        />
      </PageEnter>
    </main>
  );
}
