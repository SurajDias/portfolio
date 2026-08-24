import { ArrowUpRight, ChevronDown, GitBranch, Layers3 } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useScroll } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import ArchitecturePreview from "../components/visuals/ArchitecturePreview";
import { featuredProjects } from "../data/projects";
import useReducedMotion from "../hooks/useReducedMotion";
import { fadeUp, staggerContainer } from "../lib/motion-variants";
import { cn } from "../lib/theme";

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Engineering case studies, not just interfaces."
          description="A selection of systems shaped around useful constraints: clarity, resilience, performance, and the people who operate them."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {featuredProjects.map((project, index) => {
            if (index === 0) {
              return (
                <FlagshipProjectCard
                  key={project.name}
                  project={project}
                  index={index}
                />
              );
            }
            return (
              <BentoProjectCard
                key={project.name}
                project={project}
                index={index}
              />
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

function FlagshipProjectCard({
  project,
  index,
}: {
  project: (typeof featuredProjects)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    spotlightX.set(event.clientX - bounds.left - 144);
    spotlightY.set(event.clientY - bounds.top - 144);
  };

  const spotlightHandlers = reducedMotion
    ? {}
    : {
        onPointerEnter: (event: PointerEvent<HTMLElement>) => {
          moveSpotlight(event);
          spotlightOpacity.set(1);
        },
        onPointerMove: moveSpotlight,
        onPointerLeave: () => spotlightOpacity.set(0),
      };

  return (
    <motion.article
      ref={cardRef}
      variants={fadeUp}
      {...spotlightHandlers}
      data-cursor-text="Explore"
      className="glass-card group relative isolate overflow-hidden rounded-3xl border border-border-subtle p-7 sm:p-10 lg:col-span-12 hover:border-accent/40 transition-all duration-300 shadow-2xl"
    >
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ x: spotlightX, y: spotlightY, opacity: spotlightOpacity }}
          className="pointer-events-none absolute left-0 top-0 z-0 h-96 w-96 rounded-full bg-accent-glow/30 blur-3xl will-change-transform"
        />
      )}

      <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left Column: Sticky Architecture Diagram */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-widest">
                Flagship Project
              </span>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                0{index + 1} / {project.type}
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              {project.name}
            </h3>
          </div>

          <div>
            <ArchitecturePreview
              label={project.name}
              index={index}
              scrollProgress={scrollYProgress}
            />
          </div>
        </div>

        {/* Right Column: Case Study Narrative Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="grid gap-5">
            <Detail label="Problem">{project.problem}</Detail>
            <Detail label="Architecture">{project.architecture}</Detail>
            <Detail label="Engineering decision">{project.decisions}</Detail>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border-subtle bg-white/[0.04] px-3 py-1 text-xs font-medium text-text-muted backdrop-blur-md transition-colors hover:border-accent/30 hover:text-text-primary"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span
                aria-label={`${project.name} private repository`}
                className="inline-flex items-center gap-1.5 text-text-muted/60"
              >
                <GitBranch size={13} className="text-text-muted/40" /> Private repository
              </span>
              <span
                aria-label={`${project.name} demo unavailable`}
                className="inline-flex items-center gap-1.5 text-text-muted/60"
              >
                <ArrowUpRight size={13} className="text-text-muted/40" /> Demo unavailable
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function BentoProjectCard({
  project,
  index,
}: {
  project: (typeof featuredProjects)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    spotlightX.set(event.clientX - bounds.left - 100);
    spotlightY.set(event.clientY - bounds.top - 100);
  };

  const spotlightHandlers = reducedMotion
    ? {}
    : {
        onPointerEnter: (event: PointerEvent<HTMLElement>) => {
          moveSpotlight(event);
          spotlightOpacity.set(1);
        },
        onPointerMove: moveSpotlight,
        onPointerLeave: () => spotlightOpacity.set(0),
      };

  return (
    <motion.article
      variants={fadeUp}
      {...spotlightHandlers}
      data-cursor-text="View"
      onMouseEnter={() => !reducedMotion && setExpanded(true)}
      onMouseLeave={() => !reducedMotion && setExpanded(false)}
      className="glass-card group relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-border-subtle p-6 lg:col-span-4 hover:border-accent/40 transition-all duration-300 shadow-lg"
    >
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ x: spotlightX, y: spotlightY, opacity: spotlightOpacity }}
          className="pointer-events-none absolute left-0 top-0 z-0 h-64 w-64 rounded-full bg-accent-glow/20 blur-3xl will-change-transform"
        />
      )}

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            0{index + 1} / {project.type}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors focus:outline-none"
            aria-label={`Toggle details for ${project.name}`}
          >
            <span>{expanded ? "Less" : "Details"}</span>
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                expanded ? "rotate-180" : ""
              )}
            />
          </button>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors">
          {project.name}
        </h3>

        <div className="overflow-hidden rounded-xl border border-border-subtle/60 bg-surface/60">
          <ArchitecturePreview label={project.name} index={index} />
        </div>

        {/* Expandable Case Study details */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 pt-3 overflow-hidden"
            >
              <Detail label="Problem">{project.problem}</Detail>
              <Detail label="Architecture">{project.architecture}</Detail>
              <Detail label="Engineering decision">{project.decisions}</Detail>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-border-subtle/60 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border-subtle bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-text-muted backdrop-blur-md"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted/60">
          <span className="inline-flex items-center gap-1">
            <GitBranch size={12} className="text-text-muted/40" /> Private repo
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowUpRight size={12} className="text-text-muted/40" /> Demo unavailable
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function Detail({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        <Layers3 size={12} className="text-accent" />
        {label}
      </p>
      <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{children}</p>
    </div>
  );
}

