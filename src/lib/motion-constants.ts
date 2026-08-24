import type { Transition } from "motion/react";

/**
 * Shared Motion System Presets
 * 
 * 1. springSnappy: High stiffness, responsive spring for buttons, hover lifts, and magnetic pull.
 * 2. easeReveal: Smooth, decelerated custom cubic-bezier for scroll reveals (zero overshoot).
 * 3. springSlow: Heavy, fluid spring for large layout shifts (e.g. layoutId indicators).
 */

export const springSnappy = {
  type: "spring",
  stiffness: 380,
  damping: 22,
  mass: 0.5,
} satisfies Transition;

export const easeReveal = {
  duration: 0.65,
  ease: [0.16, 1, 0.3, 1],
} satisfies Transition;

export const springSlow = {
  type: "spring",
  stiffness: 200,
  damping: 28,
  mass: 1,
} satisfies Transition;

export const DEFAULT_VIEWPORT_MARGIN = "-80px" as const;
