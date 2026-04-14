"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

const contentStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.32, 1] as const },
  },
};

type HeroSectionProps = {
  className?: string;
};

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.04]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55], [0.45, 0.72]);
  const textY = useTransform(scrollYProgress, [0, 0.5], reduceMotion ? [0, 0] : [0, 14]);

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.995 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.32, 1] }}
      className={`relative flex min-h-[220px] w-full flex-col overflow-hidden rounded-3xl ring-1 ring-black/[0.06] sm:min-h-[240px] sm:rounded-[1.75rem] lg:h-full lg:min-h-0 lg:flex-1 ${className}`}
      style={{
        boxShadow:
          "0 2px 4px -1px rgba(15,23,42,0.04), 0 24px 48px -20px rgba(15,23,42,0.12), 0 48px 96px -32px rgba(15,23,42,0.14)",
      }}
    >
      <motion.div style={{ y: imageY, scale: imageScale }} className="relative min-h-[220px] w-full flex-1 origin-center sm:min-h-[240px] lg:min-h-0">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_APPLE_SOFT }}
        >
          <Image
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=85"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center"
          />
        </motion.div>
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/25 to-stone-800/20"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-stone-950/92 via-stone-950/40 to-transparent"
          aria-hidden
        />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 pt-12 text-center sm:px-10 sm:pb-12"
        variants={contentStagger}
        initial="hidden"
        animate="visible"
      >
        <p className="type-eyebrow mb-3 text-white/60" aria-hidden>
          EpicIndiaTrips AI Planner
        </p>
        <motion.h1
          id="hero-heading"
          variants={fadeUp}
          className="max-w-[18ch] font-sans text-[1.75rem] font-light leading-[1.15] tracking-tight text-white sm:text-[2rem] lg:text-[2.125rem]"
        >
          India trips that feel{" "}
          <span className="bg-gradient-to-r from-amber-200/95 to-orange-100/90 bg-clip-text font-normal text-transparent">
            insanely good
          </span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-white/82"
        >
          Itineraries, maps, and routes — plus creator-ready scripts and spots when you want to post.
        </motion.p>
      </motion.div>

      {!reduceMotion ? (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl sm:rounded-[1.75rem]"
          aria-hidden
          style={{
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.14)",
          }}
        />
      ) : null}
    </motion.section>
  );
}
