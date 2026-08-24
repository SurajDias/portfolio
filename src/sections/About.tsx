import { motion } from "motion/react";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "../lib/motion-variants";

const milestones = [
  [
    "01",
    "Start with the system",
    "Before implementation, I map the actors, failure modes, data paths, and decisions that matter.",
  ],
  [
    "02",
    "Make complexity legible",
    "Good architecture should help people reason about change—not become a barrier to it.",
  ],
  [
    "03",
    "Ship, observe, iterate",
    "I value a tight loop between what we build, what people experience, and what the system tells us.",
  ],
] as const;

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <SectionHeading
            eyebrow="How I work"
            title="Engineering is a discipline of intentional trade-offs."
            description="I’m Suraj Dias, a software engineer drawn to the intersection of thoughtful product design and dependable technical systems."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {milestones.map(([number, title, text]) => (
              <motion.div
                key={number}
                variants={fadeUp}
                className="glass-card group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-glass/80 p-6 sm:p-7 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs font-bold text-accent">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

