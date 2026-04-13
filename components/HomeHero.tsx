export default function HomeHero() {
  return (
    <div className="text-center lg:text-left">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight tracking-tight text-[#0c1829] sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
        <span className="text-gradient-brand">AI Travel Planner</span>
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4b5a6d] sm:text-base lg:mx-0">
        Plan faster with itinerary, budget, map, and content in one elegant flow.
      </p>
    </div>
  );
}
