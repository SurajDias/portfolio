import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

const SESSION_KEY = "portfolio_intro_seen";

interface IntroSequenceProps {
  onComplete?: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem(SESSION_KEY);
      if (hasSeen === "true") {
        setShouldRender(false);
        onComplete?.();
        return;
      }
    } catch {
      // sessionStorage unavailable fallback
    }

    if (reducedMotion) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore storage errors
      }
      setShouldRender(true);
      setIsExiting(true);
      return;
    }

    setShouldRender(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (shouldRender !== true || isExiting || reducedMotion) return;

    const DURATION_MS = 1300; // ~1.3 seconds

    const triggerExit = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore storage errors
      }
      setIsExiting(true);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const linearProgress = Math.min(elapsed / DURATION_MS, 1);

      // Eased count (easeOutCubic)
      const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
      setProgress(easedProgress);

      if (linearProgress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        triggerExit();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleSkip = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setProgress(1);
      triggerExit();
    };

    window.addEventListener("keydown", handleSkip, { once: true });
    window.addEventListener("click", handleSkip, { once: true });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [shouldRender, isExiting, reducedMotion]);

  if (shouldRender === null || !shouldRender) return null;

  const counterValue = String(Math.round(progress * 100)).padStart(3, "0");

  return (
    <AnimatePresence
      onExitComplete={() => {
        setShouldRender(false);
        onComplete?.();
      }}
    >
      {!isExiting && (
        <motion.div
          key="intro-panel"
          initial={{ y: "0%", opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { y: "-100%" }
          }
          transition={
            reducedMotion
              ? { duration: 0.15 }
              : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050816] text-text-primary select-none cursor-pointer overflow-hidden"
        >
          <div className="flex flex-col items-center gap-6 text-center px-6 max-w-md w-full">
            {/* Wordmark / Name */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl border border-accent/40 bg-accent/10 flex items-center justify-center text-accent font-mono font-bold text-sm shadow-[0_0_24px_rgba(56,189,248,0.35)]">
                SD
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                Suraj Dias
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm text-text-muted font-normal leading-relaxed"
            >
              Building AI-powered systems & scalable web applications
            </motion.p>

            {/* Progress Track */}
            <div className="w-52 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative mt-2">
              <div
                className="h-full bg-accent transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between w-52 sm:w-64 font-mono text-xs text-text-muted/80 tabular-nums">
              <span>LOADING</span>
              <span>{counterValue}%</span>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted/40 mt-1">
              Click or press any key to skip
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
