import type { Transition, Variants } from "motion/react";

export const entranceDuration = 0.5;
export const entranceEase = "easeOut";

export const entranceTransition = {
  duration: entranceDuration,
  ease: entranceEase,
} satisfies Transition;

export const interactionDuration = 0.28;
export const interactionEase = [0.22, 1, 0.36, 1] as const;

export const interactionTransition = {
  duration: interactionDuration,
  ease: interactionEase,
} satisfies Transition;

export const ambientDuration = 18;
export const ambientEase = "easeInOut";

export const ambientTransition = {
  duration: ambientDuration,
  ease: ambientEase,
  repeat: Infinity,
} satisfies Transition;

export const blueprintDuration = 19;
export const blueprintEase = "linear";

export const blueprintTransition = {
  duration: blueprintDuration,
  ease: blueprintEase,
  repeat: Infinity,
} satisfies Transition;

export const staggerChildren = 0.08;

export const staggerTransition = {
  staggerChildren,
} satisfies Transition;

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: entranceTransition,
  },
} satisfies Variants;

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: staggerTransition,
  },
} satisfies Variants;
