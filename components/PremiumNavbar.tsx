"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";
import Link from "next/link";
import { EASE_APPLE_SOFT } from "@/lib/motion-premium";

const navList = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.35 },
  },
};

const navItem = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_APPLE_SOFT } },
};

const links = [
  { href: "#creator-toolkit", label: "Creator kit" },
  { href: "#planner-form", label: "Plan" },
  { href: "#how-it-works", label: "How it works" },
] as const;

function NavLinks({ animated }: { animated: boolean }) {
  const linkClass =
    "group relative rounded-full px-4 py-2 text-[0.8125rem] font-medium text-stone-600";

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
              className="absolute inset-x-4 bottom-2 z-[1] h-[1.5px] origin-center scale-x-0 rounded-full bg-stone-900/80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
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
          transition={{ duration: 0.45, ease: EASE_APPLE_SOFT }}
          className={linkClass}
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-stone-900">{label}</span>
          <span
            className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 ease-out group-hover:bg-white/75"
            aria-hidden
          />
          <span
            className="absolute inset-x-4 bottom-2 z-[1] h-[1.5px] origin-center scale-x-0 rounded-full bg-stone-900/80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            aria-hidden
          />
        </motion.a>
      ))}
    </>
  );
}

/** Glass nav — EpicIndiaTrips AI Planner */
export default function PremiumNavbar() {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: EASE_APPLE_SOFT }}
      className="sticky top-0 z-50 border-b border-white/25 bg-white/65 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.06)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/52"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:max-w-[72rem]">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-2xl outline-none ring-offset-2 ring-offset-[var(--surface-page)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-stone-400/50 active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14120f] to-stone-800 text-white shadow-[0_4px_18px_-4px_rgba(194,65,12,0.45)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_8px_28px_-8px_rgba(194,65,12,0.35)]">
            <Compass className="h-5 w-5 transition-transform duration-500 group-hover:rotate-6" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="flex flex-col leading-[1.15]">
            <span className="text-[0.9375rem] font-semibold tracking-tight text-stone-900 sm:text-base">
              EpicIndiaTrips
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500 sm:text-[11px]">
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
