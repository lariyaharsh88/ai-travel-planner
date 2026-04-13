"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
  }),
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
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.72]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className={`relative flex min-h-[200px] w-full flex-col overflow-hidden rounded-2xl sm:rounded-[1.35rem] lg:h-full lg:min-h-0 lg:flex-1 ${className}`}
    >
      <motion.div
        style={{ y: imageY }}
        className="relative min-h-[200px] w-full flex-1 lg:min-h-0"
      >
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_APPLE }}
        >
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center"
          />
        </motion.div>
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/45 to-stone-900/30"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 via-transparent to-stone-950/45 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent"
          aria-hidden
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_100%,rgba(250,248,244,0.18),transparent_60%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-6 pt-8 text-center sm:px-6 sm:pb-8">
        <motion.h1
          id="hero-heading"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-xl font-sans text-2xl font-semibold tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-3xl lg:text-[1.75rem] lg:leading-tight xl:text-3xl"
        >
          Plan Your Perfect Trip with{" "}
          <span className="bg-gradient-to-r from-[#ffd4c4] via-white to-[#ffd4c4] bg-clip-text text-transparent">
            AI
          </span>
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-3 max-w-md text-sm leading-relaxed text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-[0.9375rem]"
        >
          Hidden gems, reels & full itineraries — crafted for India explorers.
        </motion.p>
      </div>
    </section>
  );
}
