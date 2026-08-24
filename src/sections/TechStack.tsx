import { Code2, Cpu, Server } from "lucide-react";
import { motion } from "motion/react";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { technologies, type Technology } from "../data/technologies";
import { fadeUp, staggerContainer } from "../lib/motion-variants";

const techClusters = [
  {
    label: "Languages & Core",
    icon: Code2,
    description: "Core programming languages and modern frontend frameworks for engineering robust applications.",
    items: technologies.filter((t) =>
      ["TypeScript", "React", "Python", "Java", "C", "Tailwind CSS"].includes(t.name)
    ),
  },
  {
    label: "Backend & Systems",
    icon: Server,
    description: "API servers, runtime environments, and relational/document databases.",
    items: technologies.filter((t) =>
      ["Node.js", "Express", "FastAPI", "MongoDB", "MySQL"].includes(t.name)
    ),
  },
  {
    label: "Infrastructure & Tooling",
    icon: Cpu,
    description: "Containerization, Linux OS environments, build pipelines, and micro-interactions.",
    items: technologies.filter((t) =>
      ["Docker", "Linux", "Git", "Vite", "Framer Motion"].includes(t.name)
    ),
  },
];

export default function TechStack() {
  return (
    <section
      id="tech"
      className="relative border-y border-border-subtle bg-surface/30 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-top opacity-50" />
      <Container>
        <SectionHeading
          eyebrow="Capabilities"
          title="A practical, product-minded toolset."
          description="Technology is a means to a robust outcome. I choose tools for their fit with the system, team, and maintenance horizon."
        />

        {/* 3 Logical Clusters */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {techClusters.map((cluster) => {
            const ClusterIcon = cluster.icon;
            return (
              <motion.div
                key={cluster.label}
                variants={fadeUp}
                className="glass-card group relative flex flex-col justify-between rounded-3xl border border-border-subtle p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                      <ClusterIcon size={20} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-text-primary">
                      {cluster.label}
                    </h3>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-text-muted">
                    {cluster.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {cluster.items.map((tech) => (
                      <TechPill key={tech.name} technology={tech} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Subtle Marquee Row */}
        <div className="mt-16 pt-8 border-t border-border-subtle/50">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-text-muted/60">
            Continuous Stack Overview
          </p>
          <MarqueeRow items={technologies} />
        </div>
      </Container>
    </section>
  );
}

function TechPill({ technology }: { technology: Technology }) {
  return (
    <div
      className="glass group/pill flex items-center gap-2.5 rounded-full border border-border-subtle/80 bg-white/[0.03] px-3.5 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(56,189,248,0.15)]"
      data-category={technology.category}
    >
      <img
        src={technology.iconUrl}
        alt=""
        aria-hidden="true"
        width="22"
        height="22"
        className="h-5.5 w-5.5 object-contain opacity-85 transition-all duration-300 group-hover/pill:scale-110 group-hover/pill:opacity-100"
        loading="lazy"
      />
      <span className="text-xs font-medium text-text-muted transition-colors duration-200 group-hover/pill:text-text-primary">
        {technology.name}
      </span>
    </div>
  );
}

function MarqueeRow({ items }: { items: readonly Technology[] }) {
  return (
    <div
      className="tech-marquee overflow-hidden"
      tabIndex={0}
      aria-label="Technology marquee. Animation pauses while focused."
    >
      <div className="tech-marquee__track tech-marquee__track--left">
        <TechnologySet items={items} />
        <TechnologySet items={items} hidden />
      </div>
    </div>
  );
}

function TechnologySet({
  items,
  hidden = false,
}: {
  items: readonly Technology[];
  hidden?: boolean;
}) {
  return (
    <div className="tech-marquee__set" aria-hidden={hidden || undefined}>
      {items.map((technology) => (
        <div key={technology.name} className="tech-card" data-category={technology.category}>
          <img
            src={technology.iconUrl}
            alt=""
            aria-hidden="true"
            width="22"
            height="22"
            loading="lazy"
          />
          <span>{technology.name}</span>
        </div>
      ))}
    </div>
  );
}

