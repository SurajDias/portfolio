import { motion, useReducedMotion } from "motion/react";
import { easeReveal } from "../../lib/motion-constants";

interface KineticTypographyProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staggerMs?: number;
  delayMs?: number;
}

export default function KineticTypography({
  text,
  className = "",
  as: Component = "h2",
  staggerMs = 45,
  delayMs = 0,
}: KineticTypographyProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-1 pr-[0.25em] last:pr-0">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              ...easeReveal,
              delay: (delayMs + index * staggerMs) / 1000,
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
