export default function HomeHero() {
  return (
    <div className="text-center lg:text-left">
      <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#0c1829]/10 bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1e3a5f] shadow-sm backdrop-blur-sm sm:text-xs">
        <span className="text-[#c9a227]" aria-hidden>
          ◆
        </span>
        Curated by AI
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight tracking-tight text-[#0c1829] sm:text-4xl md:text-5xl lg:text-[2.65rem] lg:leading-[1.08]">
        <span className="text-gradient-brand">AI Travel Planner</span>
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#3d4f66] sm:text-base lg:mx-0 lg:mt-4">
        Itinerary, budget, reels, blog draft, and your places on a map—fast.
      </p>
    </div>
  );
}
