"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE } from "@/lib/motion-premium";
import type { BlogContent } from "@/lib/travel-plan";

type BlogSectionProps = {
  blog: BlogContent;
};

export default function BlogSection({ blog }: BlogSectionProps) {
  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-stone-300 group-hover:shadow-md">
          <PenLine className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">Blog preview</h3>
          <p className="text-xs text-stone-500">Medium-style draft</p>
        </div>
      </div>
      <article className="rounded-2xl border border-stone-100/90 bg-[#faf9f7] p-5 transition-colors duration-500 group-hover:border-stone-200/80">
        <motion.h4
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE_APPLE }}
          className="text-xl font-semibold leading-snug tracking-tight text-stone-900 sm:text-2xl"
        >
          {blog.title}
        </motion.h4>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.55, ease: EASE_APPLE }}
          className="mt-4 max-h-52 overflow-y-auto rounded-xl border border-stone-200/80 bg-white/90 p-4 text-sm leading-[1.75] text-stone-600 shadow-inner transition-shadow duration-500 group-hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
        >
          {blog.preview}
        </motion.div>
      </article>
    </PremiumInteractiveCard>
  );
}
