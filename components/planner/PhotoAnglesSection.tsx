"use client";

import { motion } from "framer-motion";
import { Aperture } from "lucide-react";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE } from "@/lib/motion-premium";
import type { PhotoAngle } from "@/lib/travel-plan";

type PhotoAnglesSectionProps = {
  angles: PhotoAngle[];
};

export default function PhotoAnglesSection({ angles }: PhotoAnglesSectionProps) {
  if (angles.length === 0) {
    return null;
  }

  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:shadow-lg">
          <Aperture className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">Photo angles</h3>
          <p className="text-xs text-stone-500">Where to stand, how to frame, when the light hits</p>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {angles.map((row, index) => (
          <motion.li
            key={`${row.spot}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_APPLE, delay: index * 0.04 }}
            className="rounded-2xl border border-stone-100/90 bg-gradient-to-br from-stone-50/80 to-white p-4 shadow-sm ring-1 ring-stone-100/80"
          >
            <p className="text-sm font-semibold text-stone-900">{row.spot}</p>
            <dl className="mt-3 space-y-2 text-xs leading-relaxed text-stone-600">
              <div>
                <dt className="font-semibold text-stone-700">Angle</dt>
                <dd>{row.angle}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-700">Composition</dt>
                <dd>{row.composition}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-700">Light</dt>
                <dd>{row.lighting}</dd>
              </div>
            </dl>
          </motion.li>
        ))}
      </ul>
    </PremiumInteractiveCard>
  );
}
