"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ImageCardSkeleton from "@/components/planner/ImageCardSkeleton";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";
import type { UnsplashPhoto } from "@/lib/unsplash-types";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=85";

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

  const query =
    process.env.NEXT_PUBLIC_HOME_HERO_UNSPLASH_QUERY?.trim() || "India travel landscape photography";
  const [hero, setHero] = useState<UnsplashPhoto | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setHeroLoading(true);
    fetch(`/api/unsplash/search?q=${encodeURIComponent(query)}&per_page=1`)
      .then(async (r) => {
        const data = (await r.json()) as { photos?: UnsplashPhoto[] };
        const first = Array.isArray(data.photos) ? data.photos[0] : undefined;
        if (!cancelled && first?.src) setHero(first);
      })
      .catch(() => {
        if (!cancelled) setHero(null);
      })
      .finally(() => {
        if (!cancelled) setHeroLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const heroSrc = hero?.src ?? FALLBACK_HERO;
  const heroAlt = hero?.alt?.trim() ? hero.alt : "India travel — hero";

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.995 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.32, 1] }}
      className={`group relative flex min-h-[220px] w-full flex-col overflow-hidden rounded-3xl ring-1 ring-black/[0.06] sm:min-h-[240px] lg:h-full lg:min-h-0 lg:flex-1 ${className}`}
      style={{
        boxShadow:
          "0 2px 4px -1px rgba(15,23,42,0.04), 0 24px 48px -20px rgba(15,23,42,0.12), 0 48px 96px -32px rgba(15,23,42,0.14)",
      }}
    >
      <motion.div style={{ y: imageY, scale: imageScale }} className="relative min-h-[220px] w-full flex-1 origin-center sm:min-h-[240px] lg:min-h-0">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_APPLE_SOFT }}
        >
          {heroLoading ? (
            <ImageCardSkeleton className="absolute inset-0 h-full min-h-[220px] sm:min-h-[240px]" />
          ) : (
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center transition duration-[1.15s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          )}
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
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stone-950/35 via-transparent to-stone-900/25"
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
          className="max-w-[20ch] font-sans text-[1.75rem] font-light leading-[1.12] tracking-tight text-white sm:max-w-[22ch] sm:text-[2rem] lg:text-[2.125rem]"
        >
          India travel,{" "}
          <span className="bg-gradient-to-r from-amber-200/95 to-orange-100/90 bg-clip-text font-normal text-transparent">
            composed with care
          </span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-white/82"
        >
          Itineraries, maps, and legs you can trust — plus creator-ready scripts and spots when you choose to share.
        </motion.p>
        {hero && !heroLoading ? (
          <motion.a
            variants={fadeUp}
            href={hero.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-[10px] font-medium tracking-wide text-white/50 hover:text-white/85"
          >
            Photo · {hero.creditName} / Unsplash
          </motion.a>
        ) : null}
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
