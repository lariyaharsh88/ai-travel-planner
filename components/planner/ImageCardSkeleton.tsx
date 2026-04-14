"use client";

/**
 * Airbnb-style image loading shell — shimmer over a warm neutral base.
 */
export default function ImageCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-stone-200 ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200" />
      <div className="animate-shimmer-overlay absolute inset-0 opacity-90" />
    </div>
  );
}
