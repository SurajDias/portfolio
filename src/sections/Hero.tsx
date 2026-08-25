import { ArrowDownToLine, ArrowUpRight, Code2, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Container from "../components/common/Container";
import FluidHeroCanvas from "../components/visuals/FluidHeroCanvas";
import TopologyGraph from "../components/visuals/TopologyGraph";
import { EMAIL, LINKEDIN_URL, RESUME_URL } from "../config/site";
import { fadeUp, staggerContainer } from "../lib/motion-variants";
import { cn } from "../lib/theme";
import KineticTypography from "../components/ui/KineticTypography";
import { useContactModal } from "../components/common/ContactModal";

const badges = ["Open to internships", "AI", "Linux", "Full Stack"];

function MagneticPrimaryCTA({
  href,
  children,
  target,
  rel,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_36px_rgba(56,189,248,0.55)]"
    >
      {isHovered && (
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

function ArchitecturePanel({ isIntroComplete = true }: { isIntroComplete?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 16 }}
      animate={isIntroComplete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-surface-glass/80 p-2 shadow-2xl backdrop-blur-xl group hover:border-accent/30 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-radial-corner opacity-60 pointer-events-none" />
      <TopologyGraph />
    </motion.div>
  );
}

export default function Hero({ isIntroComplete = true }: { isIntroComplete?: boolean }) {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[min(920px,100svh)] items-center overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-36"
    >
      {/* WebGL Fluid Engine Background (Hero-scoped) */}
      <FluidHeroCanvas className="z-0" isIntroComplete={isIntroComplete} />
      {/* Dark gradient scrim layer for text legibility over fluid splats */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background/50 via-background/65 to-background" />

      {/* Soft gradient mesh backdrop anchored in corners */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial-top opacity-60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[-10%] z-0 h-[550px] w-[550px] rounded-full bg-accent-glow/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-[-10%] z-0 h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[120px]"
      />

      <div className="relative z-10 w-full">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <motion.div
              initial="hidden"
              animate={isIntroComplete ? "visible" : "hidden"}
              variants={staggerContainer}
              className="flex flex-col items-start"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Software Engineer
                </span>
              </motion.div>

              <div className="mt-5">
                <KineticTypography
                  text="Suraj Dias"
                  as="h1"
                  className="text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-text-primary sm:text-7xl lg:text-8xl"
                  staggerMs={90}
                  delayMs={100}
                  play={isIntroComplete}
                />
              </div>

              <div className="mt-6 max-w-xl">
                <KineticTypography
                  text="Building AI-powered systems, developer tools, and scalable web applications."
                  as="p"
                  className="text-lg leading-relaxed text-text-muted sm:text-xl font-normal"
                  staggerMs={35}
                  delayMs={250}
                  play={isIntroComplete}
                />

                {/* Group-revealed glass badge pills */}
                <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2.5">
                  {badges.map((badge, index) => (
                    <span
                      key={badge}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors duration-200 hover:border-accent/40",
                        index === 0
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-border-subtle bg-white/[0.03] text-text-muted"
                      )}
                    >
                      {index === 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      )}
                      {badge}
                    </span>
                  ))}
                </motion.div>
              </div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-3.5"
              >
                <MagneticPrimaryCTA
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Open Suraj Dias resume PDF in a new tab; use the PDF viewer to download it"
                >
                  Download Resume
                  <ArrowDownToLine size={16} />
                </MagneticPrimaryCTA>

                <a
                  href="https://github.com/surajdias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:border-accent/40 hover:bg-white/10 hover:text-white"
                >
                  View GitHub
                  <Code2 size={16} className="text-text-muted" />
                </a>

                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Suraj Dias LinkedIn profile in a new tab"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:border-accent/40 hover:bg-white/10 hover:text-white"
                >
                  LinkedIn
                  <ArrowUpRight size={16} className="text-text-muted" />
                </a>

                <button
                  type="button"
                  onClick={openContactModal}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:text-accent cursor-pointer"
                >
                  Contact
                  <ArrowUpRight size={15} />
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-12 flex items-center gap-2 text-xs font-medium text-text-muted/80"
              >
                <Mail size={14} className="text-accent" />
                <span>{EMAIL}</span>
              </motion.div>
            </motion.div>

            <ArchitecturePanel isIntroComplete={isIntroComplete} />
          </div>
        </Container>
      </div>
    </section>
  );
}