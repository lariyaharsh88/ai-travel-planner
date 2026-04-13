/** Decorative SVGs — no external assets */
export default function TravelHeroArt() {
  return (
    <div
      className="pointer-events-none mx-auto mb-6 flex max-w-md justify-center gap-6 opacity-90 sm:mb-5"
      aria-hidden
    >
      <svg width="72" height="56" viewBox="0 0 72 56" fill="none" className="text-[#1e3a5f]">
        <path
          d="M8 44 L36 8 L64 44 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <circle cx="36" cy="28" r="4" fill="#c9a227" />
        <path d="M20 44h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg width="72" height="56" viewBox="0 0 72 56" fill="none" className="text-[#c9a227]">
        <ellipse cx="36" cy="30" rx="28" ry="12" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M12 18c8-6 40-6 48 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="36" cy="30" r="3" fill="#0c1829" />
      </svg>
      <svg width="72" height="56" viewBox="0 0 72 56" fill="none" className="text-[#e8a87c]">
        <rect x="10" y="14" width="52" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M10 22h52M22 14v32M50 14v32" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    </div>
  );
}
