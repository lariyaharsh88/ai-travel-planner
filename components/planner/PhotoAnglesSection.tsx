"use client";

import { motion } from "framer-motion";
import PlaceImage from "@/components/planner/PlaceImage";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE } from "@/lib/motion-premium";
import type { PhotoAngle } from "@/lib/travel-plan";

type PhotoAnglesSectionProps = {
  angles: PhotoAngle[];
  destination: string;
  variant?: "default" | "studio";
};

function shotPill(shotType?: string): { label: string; className: string } | null {
  if (!shotType?.trim()) return null;
  const s = shotType.trim();
  const u = s.toLowerCase();
  if (u.includes("drone")) return { label: s, className: "from-violet-600/90 to-indigo-600/90" };
  if (u.includes("pov")) return { label: s, className: "from-amber-600/90 to-orange-600/90" };
  if (u.includes("wide")) return { label: s, className: "from-emerald-600/90 to-teal-700/90" };
  return { label: s, className: "from-stone-700/90 to-stone-900/90" };
}

export default function PhotoAnglesSection({
  angles,
  destination,
  variant = "default",
}: PhotoAnglesSectionProps) {
  const dest = destination.trim() || "India";

  if (angles.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-4 py-8 text-center text-sm text-stone-500">
        No angle cards yet — regenerate with Creator Mode for wide / drone / POV ideas.
      </p>
    );
  }

  const listClass =
    variant === "studio"
      ? "-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]"
      : "grid gap-4 sm:grid-cols-2";

  const cardWidthClass =
    variant === "studio"
      ? "min-w-[min(100%,300px)] flex-[0_0_auto] snap-center sm:min-w-0"
      : "";

  const inner = (
    <div className={listClass}>
      {angles.map((row, index) => {
        const pill = shotPill(row.shotType);
        return (
          <motion.article
            key={`${row.spot}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_APPLE, delay: index * 0.03 }}
            whileHover={{ y: variant === "studio" ? -3 : 0, transition: { duration: 0.4, ease: EASE_APPLE } }}
            className={`group/pa overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm ring-1 ring-stone-100/80 ${cardWidthClass}`}
          >
            <div className="relative">
              <PlaceImage
                place={row.spot}
                destination={dest}
                aspectClassName="aspect-[16/10] min-h-[120px]"
                className="rounded-t-2xl"
              />
              {pill ? (
                <span
                  className={`absolute left-3 top-3 rounded-full bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-md ring-1 ring-white/25 ${pill.className}`}
                >
                  {pill.label}
                </span>
              ) : null}
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm font-semibold text-stone-900">{row.spot}</p>
              <dl className="space-y-2 text-xs leading-relaxed text-stone-600">
                <div>
                  <dt className="font-semibold text-stone-800">Angle</dt>
                  <dd>{row.angle}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-800">Composition</dt>
                  <dd>{row.composition}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-800">Light</dt>
                  <dd>{row.lighting}</dd>
                </div>
              </dl>
            </div>
          </motion.article>
        );
      })}
    </div>
  );

  if (variant === "studio") {
    return inner;
  }

  return <PremiumInteractiveCard className="p-4 sm:p-5" hoverLift={5}>{inner}</PremiumInteractiveCard>;
}
