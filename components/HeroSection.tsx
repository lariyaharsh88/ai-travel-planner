"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE_APPLE } from "@/lib/motion-premium";

const contentStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
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
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.07]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55], [0.52, 0.78]);
  const textY = useTransform(scrollYProgress, [0, 0.5], reduceMotion ? [0, 0] : [0, 18]);

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease: EASE_APPLE }}
      className={`relative flex min-h-[200px] w-full flex-col overflow-hidden rounded-2xl shadow-[0_32px_64px_-28px_rgba(15,23,42,0.22),0_0_0_1px_rgba(255,255,255,0.06)_inset] ring-1 ring-white/10 sm:rounded-[1.35rem] lg:h-full lg:min-h-0 lg:flex-1 ${className}`}
    >
      <motion.div style={{ y: imageY, scale: imageScale }} className="relative min-h-[200px] w-full flex-1 origin-center lg:min-h-0">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.25, ease: EASE_APPLE }}
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
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/5 to-stone-900/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/22 via-transparent to-stone-950/5 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-stone-950/92 via-stone-950/55 to-transparent"
          aria-hidden
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_65%_at_50%_100%,rgba(255,107,53,0.08),transparent_55%)]" />

      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-6 pt-8 text-center sm:px-6 sm:pb-8"
        variants={contentStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          id="hero-heading"
          variants={fadeUp}
          className="max-w-xl font-sans text-2xl font-semibold tracking-tight text-white [text-shadow:0_4px_32px_rgba(0,0,0,0.55)] sm:text-3xl lg:text-[1.75rem] lg:leading-tight xl:text-3xl"
        >
          Plan Your Perfect Trip with{" "}
          <motion.span
            className="inline-block bg-gradient-to-r from-[#ffc4a8] via-white to-[#ffd4c4] bg-clip-text text-transparent"
            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            AI
          </motion.span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-md text-sm leading-relaxed text-white/95 [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] sm:text-[0.9375rem]"
        >
          Hidden gems, reels & full itineraries — crafted for India explorers.
        </motion.p>
        <motion.div
          variants={{
            hidden: { opacity: 0, scaleX: 0 },
            visible: {
              opacity: 1,
              scaleX: 1,
              transition: { delay: 0.32, duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
            },
          }}
          className="mt-6 h-px w-28 origin-center rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />
      </motion.div>

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.35rem]"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          style={{
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.12)",
          }}
        />
      ) : null}
    </motion.section>
  );
}
