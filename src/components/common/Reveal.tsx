import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DEFAULT_VIEWPORT_MARGIN, easeReveal } from "../../lib/motion-constants";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  once?: boolean;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 20,
  duration,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (shouldReduceMotion || direction === "none") return { x: 0, y: 0 };
    switch (direction) {
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <motion.div
      initial={{ opacity: 0, x: initialPos.x, y: initialPos.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: DEFAULT_VIEWPORT_MARGIN }}
      transition={
        duration
          ? { duration, ease: easeReveal.ease, delay }
          : { ...easeReveal, delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
