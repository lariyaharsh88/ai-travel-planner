import type { Transition, Variants } from "framer-motion";

/** Apple-style long ease-out (smooth deceleration) */
export const EASE_APPLE = [0.22, 1, 0.36, 1] as const;

/** Slightly softer entrance (hero, large blocks) */
export const EASE_APPLE_SOFT = [0.16, 1, 0.32, 1] as const;

export const enterTransition: Transition = {
  duration: 0.58,
  ease: EASE_APPLE,
};

export const enterSoftTransition: Transition = {
  duration: 0.78,
  ease: EASE_APPLE_SOFT,
};

/** Section list items — soft, less motion sickness */
export const sectionItemTransition: Transition = {
  duration: 0.74,
  ease: EASE_APPLE_SOFT,
};

/** Micro-interaction spring — crisp but not bouncy */
export const springTap: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 44,
  mass: 0.85,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 40,
};

/** Page / column — stagger children (Airbnb-style reveals) */
export const staggerPage: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.072, delayChildren: 0.1, when: "beforeChildren" },
  },
};

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_APPLE_SOFT },
  },
};

/** Short list stagger (cards, chips) */
export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.048, delayChildren: 0.05 } },
};

export const fadeInItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: EASE_APPLE_SOFT } },
};
