import TravelPlanningForm from "@/components/TravelPlanningForm";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 surface-hero noise-overlay" aria-hidden />
      <div className="relative mx-auto flex max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8">
        <header className="mb-10 text-center sm:mb-14">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#0c1829]/10 bg-white/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#1e3a5f] shadow-sm backdrop-blur-sm">
            <span className="text-[#c9a227]" aria-hidden>
              ◆
            </span>
            Curated by AI
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-[1.1] tracking-tight text-[#0c1829] sm:text-5xl md:text-6xl">
            <span className="text-gradient-brand">AI Travel Planner</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#3d4f66] sm:text-lg">
            Tell us where you are going and how you like to travel. We will craft an itinerary,
            budget snapshot, content ideas, and a map of your must-see spots.
          </p>
        </header>

        <div className="mx-auto w-full max-w-5xl">
          <TravelPlanningForm />
        </div>
      </div>
    </main>
  );
}
