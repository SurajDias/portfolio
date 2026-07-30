import { motion } from "framer-motion";
import { cn } from "../../lib/theme";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({ children, href, variant = "primary", className }: Props) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] hover:bg-blue-500"
      : "border border-white/10 bg-white/[0.035] text-slate-200 hover:border-white/20 hover:bg-white/[0.07]",
    className,
  );
  const content = <>{children}</>;

  if (href) return <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href={href} className={styles}>{content}</motion.a>;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={styles}
    >
      {content}
    </motion.button>
  );
}
