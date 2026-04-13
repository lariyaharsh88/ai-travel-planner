"use client";

import { motion } from "framer-motion";
import { Check, Clapperboard, Copy } from "lucide-react";
import { useState } from "react";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { ReelIdea } from "@/lib/travel-plan";

type ReelCarouselProps = {
  ideas: ReelIdea[];
};

export default function ReelCarousel({ ideas }: ReelCarouselProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (index: number, idea: ReelIdea) => {
    const content = `${idea.hook}\n\n${idea.caption}\n\n${idea.hashtags.join(" ")}`;
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1600);
  };

  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#ff8f66] text-white shadow-md shadow-[#FF6B35]/25 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:shadow-lg">
          <Clapperboard className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">Reel ideas</h3>
          <p className="text-xs text-stone-500">Swipe for hooks & captions</p>
        </div>
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
        {ideas.map((idea, index) => (
          <motion.article
            key={`${idea.hook}-${index}`}
            whileHover={{
              y: -6,
              transition: { duration: 0.45, ease: EASE_APPLE },
            }}
            whileTap={{ scale: 0.99 }}
            transition={springGentle}
            className="min-w-[min(100%,320px)] flex-[0_0_auto] snap-center rounded-2xl border border-stone-100/90 bg-gradient-to-br from-stone-50 to-white p-4 shadow-sm transition-[box-shadow] duration-500 hover:border-stone-200 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.14)]"
          >
            <p className="font-medium leading-snug text-stone-900">{idea.hook}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{idea.caption}</p>
            <p className="mt-3 text-xs text-stone-400">{idea.hashtags.join(" ")}</p>
            <motion.button
              type="button"
              onClick={() => handleCopy(index, idea)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={springGentle}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              {copiedIndex === index ? (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springGentle}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </motion.button>
          </motion.article>
        ))}
      </div>
    </PremiumInteractiveCard>
  );
}
