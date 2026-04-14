"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Compass, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
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
    "group relative inline-flex items-center justify-center rounded-full px-4 py-2 text-[0.8125rem] font-medium text-stone-600";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: EASE_APPLE_SOFT }}
      className="glass-nav sticky top-0 z-50 border-b border-white/40 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.03]"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-8 lg:max-w-[72rem]">
        <Link
          href="/"
          className="group flex min-h-[44px] min-w-0 items-center gap-3 rounded-2xl outline-none ring-offset-2 ring-offset-[var(--surface-page)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-stone-400/50 active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14120f] to-stone-800 text-white shadow-[0_4px_18px_-4px_rgba(194,65,12,0.45)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_8px_28px_-8px_rgba(194,65,12,0.35)]">
            <Compass className="h-5 w-5 transition-transform duration-500 group-hover:rotate-6" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="flex min-w-0 flex-col leading-[1.15]">
            <span className="truncate text-[0.9375rem] font-semibold tracking-tight text-stone-900 sm:text-base">
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

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 bg-white/80 text-stone-800 shadow-sm backdrop-blur-sm transition hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400/50 sm:hidden"
          aria-expanded={mobileOpen}
          aria-controls={menuId}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.75} aria-hidden /> : <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav"
            id={menuId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: EASE_APPLE_SOFT }}
            className="overflow-hidden border-t border-stone-200/60 bg-[var(--glass-bg)] backdrop-blur-xl sm:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4 pb-[calc(1rem+var(--safe-bottom))]" aria-label="Primary mobile">
              {links.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-[0.9375rem] font-medium text-stone-800 transition hover:bg-white/60 active:bg-white/80"
                >
                  {label}
                </a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
