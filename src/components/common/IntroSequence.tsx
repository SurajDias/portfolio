import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";
import { easeReveal } from "../../lib/motion-constants";

const SESSION_KEY = "portfolio_intro_seen";

/**
 * First-visit session intro sequence (< 1.2s)
 * - Only plays once per session (sessionStorage flag)
 * - Instantly skippable via click or keypress
 * - Non-blocking overlay (SEO HTML remains fully rendered beneath)
 */
export default function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    try {
      const hasSeen = sessionStorage.getItem(SESSION_KEY);
      if (!hasSeen) {
        setVisible(true);
      }
    } catch {
      // sessionStorage unavailable fallback
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!visible) return;

    const dismiss = () => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore storage errors
      }
    };

    const timer = setTimeout(dismiss, 1200);

    const handleKeyDown = () => dismiss();
    const handleClick = () => dismiss();

    window.addEventListener("keydown", handleKeyDown, { once: true });
    window.addEventListener("click", handleClick, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ...easeReveal, duration: 0.4 }}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816] cursor-pointer select-none"
        >
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...easeReveal, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-xl border border-accent/40 bg-accent/10 flex items-center justify-center text-accent font-mono font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                SD
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-primary">
                Suraj Dias
              </span>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ ...easeReveal, duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
            />

            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted/60">
              Click or key to skip
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
