import { ArrowUpRight, Check, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Container from "../components/common/Container";
import { EMAIL } from "../config/site";
import { fadeUp } from "../lib/motion-variants";
import { cn } from "../lib/theme";
import { useContactModal } from "../components/common/ContactModal";

function MagneticButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * 0.15,
      y: (e.clientY - centerY) * 0.15,
    });
    setGlowPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    variant === "primary"
      ? "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] cursor-pointer"
      : "glass relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium text-text-primary transition-all duration-300 hover:border-accent/40 hover:bg-white/10 hover:text-white cursor-pointer";

  if (href) {
    return (
      <motion.a
        ref={buttonRef as unknown as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
        className={cn(baseStyles, className)}
      >
        {isHovered && variant === "primary" && (
          <span
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              background: `radial-gradient(120px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
            }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef as unknown as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      className={cn(baseStyles, className)}
    >
      {isHovered && variant === "primary" && (
        <span
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(120px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<number | undefined>(undefined);
  const { openContactModal } = useContactModal();

  useEffect(() => () => window.clearTimeout(resetTimeout.current), []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(resetTimeout.current);
      resetTimeout.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.section
      id="contact"
      initial="hidden"
      whileInView="visible"
      variants={fadeUp}
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-24 sm:py-32"
    >
      {/* Bookending radial gradient mesh behind closing contact card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent-glow/20 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 -z-10 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[130px]"
      />

      <Container>
        <div className="glass-card relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-glass/80 p-9 sm:p-14 lg:p-16 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Contact
            </span>
          </div>

          <div className="relative mt-7 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-text-primary sm:text-5xl lg:text-6xl">
                Have a complex idea worth building?
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl font-normal max-w-xl">
                I’m always interested in purposeful products, difficult technical problems, and conversations with people who care about the craft.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <MagneticButton onClick={openContactModal} variant="primary">
                <Mail size={16} /> Start a conversation <ArrowUpRight size={16} />
              </MagneticButton>

              <MagneticButton onClick={handleCopyEmail} variant="secondary">
                {copied && <Check size={16} aria-hidden="true" className="text-emerald-400" />}
                <span>{copied ? "Copied!" : "Copy Email"}</span>
              </MagneticButton>

              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard." : ""}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </motion.section>
  );
}

