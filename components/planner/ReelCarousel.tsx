"use client";

import { motion } from "framer-motion";
import { Check, Clapperboard, Copy } from "lucide-react";
import { useState } from "react";
import PlaceImage from "@/components/planner/PlaceImage";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE, springGentle } from "@/lib/motion-premium";
import type { ReelIdea } from "@/lib/travel-plan";

type ReelCarouselProps = {
  ideas: ReelIdea[];
  destination: string;
  variant?: "default" | "studio";
};

type CopyKind = "all" | "hook" | "caption" | null;

export default function ReelCarousel({ ideas, destination, variant = "default" }: ReelCarouselProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedKind, setCopiedKind] = useState<CopyKind>(null);

  const runCopy = async (index: number, idea: ReelIdea, kind: Exclude<CopyKind, null>) => {
    let content = "";
    if (kind === "hook") content = idea.hook;
    else if (kind === "caption") {
      content = `${idea.caption}\n\n${idea.hashtags.join(" ")}`;
    } else {
      const scriptBlock = idea.script ? `\n\nScript:\n${idea.script}\n` : "";
      content = `${idea.hook}${scriptBlock}\n\n${idea.caption}\n\n${idea.hashtags.join(" ")}`;
    }
    await navigator.clipboard.writeText(content.trim());
    setCopiedIndex(index);
    setCopiedKind(kind);
    setTimeout(() => {
      setCopiedIndex(null);
      setCopiedKind(null);
    }, 1600);
  };

  if (ideas.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-4 py-8 text-center text-sm text-stone-500">
        No reel ideas in this plan — toggle Creator Mode and generate again.
      </p>
    );
  }

  const dest = destination.trim() || "India";

  const inner = (
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
          className="min-w-[min(100%,320px)] flex-[0_0_auto] snap-center overflow-hidden rounded-2xl border border-stone-100/90 bg-gradient-to-br from-stone-50 to-white shadow-sm transition-[box-shadow] duration-500 hover:border-stone-200 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.14)]"
        >
          <PlaceImage
            place={`Reel ${index + 1} — ${idea.hook.slice(0, 48)}`}
            destination={dest}
            aspectClassName="aspect-[16/9] min-h-[120px] max-h-[160px]"
            className="rounded-t-2xl"
          />
          <div className="p-4">
            <p className="font-medium leading-snug text-stone-900">{idea.hook}</p>
            {idea.script ? (
              <p className="mt-3 rounded-xl border border-stone-100 bg-stone-50/90 px-3 py-2.5 text-xs leading-relaxed text-stone-700">
                <span className="font-semibold text-stone-900">Script: </span>
                {idea.script}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{idea.caption}</p>
            <p className="mt-3 text-xs text-stone-400">{idea.hashtags.join(" ")}</p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <motion.button
                  type="button"
                  onClick={() => runCopy(index, idea, "hook")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springGentle}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-[11px] font-semibold text-stone-800 shadow-sm min-[400px]:flex-initial"
                >
                  {copiedIndex === index && copiedKind === "hook" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  Hook
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => runCopy(index, idea, "caption")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springGentle}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-[11px] font-semibold text-stone-800 shadow-sm min-[400px]:flex-initial"
                >
                  {copiedIndex === index && copiedKind === "caption" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  Caption
                </motion.button>
              </div>
              <motion.button
                type="button"
                onClick={() => runCopy(index, idea, "all")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springGentle}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                {copiedIndex === index && copiedKind === "all" ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied full pack
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy hook + script + caption
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );

  if (variant === "studio") {
    return inner;
  }

  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
      <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:shadow-lg">
          <Clapperboard className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <p className="text-xs text-stone-500">Hooks, captions & hashtags — copy what you need</p>
      </div>
      {inner}
    </PremiumInteractiveCard>
  );
}
