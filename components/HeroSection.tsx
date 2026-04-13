"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type HeroSectionProps = {
  className?: string;
};

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.5, 0.68]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-[1.35rem] ${className}`}
    >
      <motion.div
        style={{ y: imageY }}
        className="relative h-[180px] w-full sm:h-[200px] lg:h-[min(280px,calc(100vh-11rem))] lg:min-h-[220px]"
      >
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/5 to-stone-900/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/18 via-transparent to-stone-950/35 mix-blend-soft-light"
          aria-hidden
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_100%,rgba(250,248,244,0.22),transparent_60%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 py-3 text-center sm:px-5">
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-xl font-sans text-2xl font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-[1.65rem] lg:leading-snug xl:text-3xl"
        >
          Plan Your Perfect Trip with{" "}
          <span className="bg-gradient-to-r from-[#ffb89a] via-white to-[#ffd4c4] bg-clip-text text-transparent">
            AI
          </span>
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-2 max-w-md text-xs leading-relaxed text-white/88 sm:mt-2.5 sm:text-sm lg:mt-2 lg:text-[13px] lg:leading-relaxed"
        >
          Hidden gems, reels & full itineraries — crafted for India explorers.
        </motion.p>
      </div>
    </section>
  );
}
