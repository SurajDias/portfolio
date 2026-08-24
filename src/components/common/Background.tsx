import { motion } from "motion/react";
import useReducedMotion from "../../hooks/useReducedMotion";
import { ambientTransition } from "../../lib/motion-variants";

export default function Background() {
  const reducedMotion = useReducedMotion();
  return (
    <div aria-hidden="true">
      <div className="fixed inset-0 -z-50 bg-background" />
      <motion.div
        animate={reducedMotion ? { opacity: 0.12 } : { x: [0, 30, 0], y: [0, 25, 0], opacity: [0.12, 0.18, 0.12] }}
        transition={reducedMotion ? undefined : ambientTransition}
        className="fixed -left-48 -top-40 -z-40 h-[46rem] w-[46rem] rounded-full bg-indigo-600/20 blur-[180px]"
      />
      <div className="fixed right-[-16rem] top-[28rem] -z-40 h-[40rem] w-[40rem] rounded-full bg-sky-500/[0.08] blur-[160px]" />
      <div className="pointer-events-none fixed inset-0 -z-35 bg-[radial-gradient(ellipse_at_top,transparent_20%,rgba(5,8,22,.5)_100%)]" />
      <div className="noise pointer-events-none fixed inset-0 -z-20 opacity-[0.02]" />
    </div>
  );
}

