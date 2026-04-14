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
      <div className="mt-3 h-px w-10 rounded-full bg-gradient-to-r from-[#c2410c]/60 to-stone-300/40" aria-hidden />
      <h2 id="how-it-works-heading" className="type-display-lg mt-6 text-balance">
        From one brief to a complete dossier
      </h2>
      <p className="type-body-muted mt-5 max-w-[40ch]">
        No tab-hopping. The same run produces itinerary, map, budget, and — when you want it — creator-ready assets.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {steps.map((s) => (
          <li
            key={s.n}
            className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white/70 p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] ring-1 ring-black/[0.02] backdrop-blur-sm"
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
