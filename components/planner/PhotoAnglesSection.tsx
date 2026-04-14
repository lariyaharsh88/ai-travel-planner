"use client";

import { motion } from "framer-motion";
import PlaceImage from "@/components/planner/PlaceImage";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE } from "@/lib/motion-premium";
import type { PhotoAngle } from "@/lib/travel-plan";

type PhotoAnglesSectionProps = {
  angles: PhotoAngle[];
  destination: string;
};

export default function PhotoAnglesSection({ angles, destination }: PhotoAnglesSectionProps) {
  if (angles.length === 0) {
    return null;
  }

  const dest = destination.trim() || "India";

  return (
    <PremiumInteractiveCard className="p-4 sm:p-5" hoverLift={5}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {angles.map((row, index) => (
          <motion.li
            key={`${row.spot}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_APPLE, delay: index * 0.04 }}
            className="group/pa overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm ring-1 ring-stone-100/80"
          >
            <PlaceImage
              place={row.spot}
              destination={dest}
              aspectClassName="aspect-[16/10] min-h-[120px]"
              className="rounded-t-2xl"
            />
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
          </motion.li>
        ))}
      </ul>
    </PremiumInteractiveCard>
  );
}
