const steps = [
  {
    n: "01",
    title: "Brief",
    body: "Destination, budget, and how you travel — one focused form.",
  },
  {
    n: "02",
    title: "Compose",
    body: "Days, legs, and spend shaped into a route you can follow.",
  },
  {
    n: "03",
    title: "Carry",
    body: "Map, PDF, and creator notes — ready offline or in the field.",
  },
] as const;

export default function HowItWorksIntro() {
  return (
    <div className="max-w-xl">
      <p className="type-eyebrow">Flow</p>
      <div className="mt-3 h-px w-8 rounded-full bg-gradient-to-r from-[#c2410c]/55 to-transparent" aria-hidden />
      <h2 id="how-it-works-heading" className="type-display-lg mt-5 text-balance">
        From one brief to a complete dossier
      </h2>
      <p className="type-body-muted mt-3 max-w-[40ch]">
        One run: itinerary, map, budget, and optional creator assets — no tool-hopping.
      </p>

      <ol className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {steps.map((s) => (
          <li
            key={s.n}
            className="relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white/80 p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)] sm:p-5"
          >
            <p className="font-mono text-[10px] font-medium tabular-nums tracking-[0.2em] text-stone-400">{s.n}</p>
            <p className="mt-3 text-[0.9375rem] font-medium tracking-tight text-stone-900">{s.title}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-stone-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
