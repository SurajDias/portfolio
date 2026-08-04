import { cn } from "../../lib/theme";
import { motion } from "motion/react";
import { interactionTransition } from "../../lib/motion-variants";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  target?: "_blank";
  rel?: string;
  ariaLabel?: string;
};

export default function Button({ children, href, variant = "primary", className, target, rel, ariaLabel }: Props) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium shadow-[0_8px_18px_rgba(0,0,0,0.12)] focus-visible:outline-offset-4",
    variant === "primary"
      ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] hover:bg-blue-500 hover:shadow-[0_14px_28px_rgba(37,99,235,0.3)]"
      : "border border-white/10 bg-white/[0.035] text-slate-200 hover:border-sky-300/30 hover:bg-white/[0.07] hover:shadow-[0_12px_24px_rgba(14,116,144,0.12)]",
    className,
  );
  const content = <>{children}</>;
  const interactions = variant === "primary"
    ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } }
    : { whileHover: { y: -1 } };

  if (href) return <motion.a {...interactions} transition={interactionTransition} href={href} target={target} rel={rel} aria-label={ariaLabel} className={styles}>{content}</motion.a>;

  return (
    <motion.button {...interactions} transition={interactionTransition} className={styles}>
      {content}
    </motion.button>
  );
}
