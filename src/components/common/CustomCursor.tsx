import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "card">("default");
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 450, damping: 28, mass: 0.35 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === "undefined" || shouldReduceMotion) return;

    // Detect fine pointer devices (desktops/laptops with mouse/trackpad)
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Scoped check: disable custom cursor dot when inside Hero section
      // where WebGL fluid ink simulation provides cursor reactivity
      const heroElem = document.getElementById("top");
      if (heroElem) {
        const rect = heroElem.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        setIsOverHero(inside);
      } else {
        setIsOverHero(false);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor], [data-cursor-text]"
      );

      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor-text");
        const customState = cursorTarget.getAttribute("data-cursor");

        if (text || customState === "card") {
          setCursorState("card");
          setCursorText(text || "View");
        } else {
          setCursorState("hover");
          setCursorText("");
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor], [data-cursor-text]"
      );

      if (cursorTarget) {
        setCursorState("default");
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (!isEnabled || shouldReduceMotion || isOverHero) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full backdrop-blur-[2px]"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: cursorState === "card" ? 64 : cursorState === "hover" ? 40 : 10,
        height: cursorState === "card" ? 64 : cursorState === "hover" ? 40 : 10,
        backgroundColor:
          cursorState === "card"
            ? "rgba(56, 189, 248, 0.22)"
            : cursorState === "hover"
            ? "rgba(56, 189, 248, 0.12)"
            : "rgba(56, 189, 248, 0.9)",
        borderColor:
          cursorState === "default"
            ? "transparent"
            : "rgba(56, 189, 248, 0.5)",
        borderWidth: cursorState === "default" ? 0 : 1,
        boxShadow:
          cursorState === "card"
            ? "0 0 24px rgba(56, 189, 248, 0.35)"
            : cursorState === "hover"
            ? "0 0 16px rgba(56, 189, 248, 0.25)"
            : "0 0 10px rgba(56, 189, 248, 0.7)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      <AnimatePresence>
        {cursorState === "card" && cursorText && (
          <motion.span
            key={cursorText}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="text-[11px] font-bold uppercase tracking-wider text-accent drop-shadow-sm"
          >
            {cursorText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
