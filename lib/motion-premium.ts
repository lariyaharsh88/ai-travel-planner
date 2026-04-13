import type { Transition } from "framer-motion";

/** Apple-style long ease-out (smooth deceleration) */
export const EASE_APPLE = [0.22, 1, 0.36, 1] as const;

/** Slightly softer entrance (hero, large blocks) */
export const EASE_APPLE_SOFT = [0.16, 1, 0.32, 1] as const;

export const enterTransition: Transition = {
  duration: 0.58,
  ease: EASE_APPLE,
};

export const enterSoftTransition: Transition = {
  duration: 0.72,
  ease: EASE_APPLE_SOFT,
};

/** Micro-interaction spring — crisp but not bouncy */
export const springTap: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.85,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
};
