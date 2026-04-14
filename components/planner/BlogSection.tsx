"use client";

import { motion } from "framer-motion";
import PremiumInteractiveCard from "@/components/ui/PremiumInteractiveCard";
import { EASE_APPLE } from "@/lib/motion-premium";
import type { BlogContent } from "@/lib/travel-plan";

type BlogSectionProps = {
  blog: BlogContent;
};

export default function BlogSection({ blog }: BlogSectionProps) {
  return (
    <PremiumInteractiveCard className="p-5 sm:p-6" hoverLift={5}>
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
        {blog.seoSections && blog.seoSections.length > 0 ? (
          <div className="mt-6 space-y-5 border-t border-stone-200/80 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">SEO outline</p>
            <ul className="space-y-4">
              {blog.seoSections.map((sec, i) => (
                <motion.li
                  key={`${sec.heading}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: EASE_APPLE }}
                  className="rounded-xl border border-stone-100 bg-white/80 p-4"
                >
                  <h3 className="text-base font-semibold text-stone-900">{sec.heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{sec.body}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
    </PremiumInteractiveCard>
  );
}
