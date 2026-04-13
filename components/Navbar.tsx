"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";
import Link from "next/link";
import { EASE_APPLE } from "@/lib/motion-premium";

const navList = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.35 },
  },
};

const navItem = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_APPLE } },
};

const links = [
  { href: "#planner-form", label: "Plan" },
  { href: "#how-it-works", label: "How it works" },
] as const;

function NavLinks({ animated }: { animated: boolean }) {
  const linkClass =
    "group relative rounded-full px-4 py-2 text-sm font-medium text-stone-600";

  if (!animated) {
    return (
      <>
        {links.map(({ href, label }) => (
          <a key={href} href={href} className={linkClass}>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-stone-900">{label}</span>
            <span
              className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 ease-out group-hover:bg-white/75"
              aria-hidden
            />
            <span
              className="absolute inset-x-4 bottom-2 z-[1] h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-[#FF6B35]/90 to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              aria-hidden
            />
          </a>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map(({ href, label }) => (
        <motion.a
          key={href}
          href={href}
          variants={navItem}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.35, ease: EASE_APPLE }}
          className={linkClass}
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-stone-900">{label}</span>
          <span
            className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 ease-out group-hover:bg-white/75"
            aria-hidden
          />
          <span
            className="absolute inset-x-4 bottom-2 z-[1] h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-[#FF6B35]/90 to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            aria-hidden
          />
        </motion.a>
      ))}
    </>
  );
}

export default function Navbar() {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE_APPLE }}
      className="sticky top-0 z-50 border-b border-stone-200/50 bg-[#faf8f4]/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#faf8f4]/72"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-2xl outline-none ring-offset-2 ring-offset-[#faf8f4] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#FF6B35]/45 active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-[0_8px_24px_-8px_rgba(28,25,23,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:shadow-[0_12px_32px_-6px_rgba(255,107,53,0.22)]">
            <Compass className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-stone-900 sm:text-base">EpicIndiaTrips</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500 sm:text-[11px]">
              AI Planner
            </span>
          </span>
        </Link>
        {reduce ? (
          <nav className="hidden items-center gap-0.5 sm:flex" aria-label="Primary">
            <NavLinks animated={false} />
          </nav>
        ) : (
          <motion.nav
            className="hidden items-center gap-0.5 sm:flex"
            aria-label="Primary"
            variants={navList}
            initial="hidden"
            animate="visible"
          >
            <NavLinks animated />
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
