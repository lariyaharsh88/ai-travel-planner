/** Large decorative illustration for desktop sidebar — inline SVG */
export default function TravelSideGraphics() {
  return (
    <div className="relative w-full" aria-hidden>
      <svg
        viewBox="0 0 440 280"
        className="h-auto w-full max-h-[min(40vh,320px)] text-[#1e3a5f]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sg-sun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8a87c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="sg-hill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0c1829" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <circle cx="360" cy="56" r="40" fill="url(#sg-sun)" />
        <path
          d="M0 220 Q110 140 220 200 T440 180 V280 H0 Z"
          fill="url(#sg-hill)"
        />
        <path
          d="M0 240 Q160 200 280 230 T440 210 V280 H0 Z"
          fill="#0c1829"
          opacity="0.12"
        />
        <path
          d="M40 120 Q120 80 200 100 T360 90"
          stroke="#c9a227"
          strokeWidth="2"
          strokeDasharray="6 8"
          opacity="0.7"
        />
        <g transform="translate(320 72)">
          <path d="M-16 4 L0 -8 L16 4 Z" fill="#1e3a5f" opacity="0.9" />
          <ellipse cx="0" cy="8" rx="20" ry="6" fill="#1e3a5f" opacity="0.35" />
        </g>
        <rect x="48" y="168" width="72" height="52" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
        <path d="M48 182h72M64 168v52" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        <circle cx="84" cy="200" r="6" fill="#c9a227" opacity="0.85" />
        <path d="M280 200 L300 175 L320 200" stroke="#e8a87c" strokeWidth="2" strokeLinecap="round" />
        <circle cx="300" cy="168" r="5" fill="#c9a227" />
      </svg>
      <ul className="mt-4 grid grid-cols-1 gap-2">
        {[
          { t: "Smart itinerary", d: "Day-by-day flow" },
          { t: "Budget + map", d: "See spend & places" },
          { t: "Content ready", d: "Reels & blog draft" },
        ].map((item) => (
          <li
            key={item.t}
            className="rounded-xl border border-[#0c1829]/8 bg-white/70 px-3 py-2 text-left shadow-sm backdrop-blur-sm"
          >
            <p className="text-xs font-semibold text-[#0c1829]">{item.t}</p>
            <p className="text-[10px] text-[#64748b]">{item.d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
