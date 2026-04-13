"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.72]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem]">
      <motion.div style={{ y: imageY }} className="relative h-[min(72vh,560px)] min-h-[320px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/55 to-stone-900/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 via-transparent to-stone-950/40 mix-blend-soft-light"
          aria-hidden
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(250,248,244,0.35),transparent_55%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-14 text-center sm:pb-16 md:pb-20">
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl font-sans text-3xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl md:leading-[1.1]"
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
          className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base"
        >
          Hidden gems, reels, and full itineraries in seconds — crafted for India explorers.
        </motion.p>
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 h-px w-24 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
