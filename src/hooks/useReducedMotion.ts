import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/** Keeps imperative and declarative motion aligned with the user's OS setting. */
export default function useReducedMotion() {
  return useMotionReducedMotion() ?? false;
}
