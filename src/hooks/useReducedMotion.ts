import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/** Keeps imperative and declarative motion aligned with the user's OS setting. */
export default function useReducedMotion() {
  return useFramerReducedMotion() ?? false;
}
