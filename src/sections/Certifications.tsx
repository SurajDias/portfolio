import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { certifications } from "../data/certifications";
import { fadeUp, staggerContainer } from "../lib/motion-variants";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative border-y border-border-subtle bg-surface/20 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-corner opacity-40" />
      <Container>
        <SectionHeading
          eyebrow="Credentials"
          title="Foundational learning, independently verified."
          description="A focused record of coursework that supports the systems and products I build."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
        >
          {certifications.map((certification) => (
            <motion.article
              key={certification.name}
              variants={fadeUp}
              className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-surface-glass/80 p-6 sm:p-7 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_12px_32px_rgba(56,189,248,0.12)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface/80 shadow-inner">
                      <img
                        src={certification.issuerLogoUrl}
                        alt=""
                        aria-hidden="true"
                        width="22"
                        height="22"
                        className="h-5.5 w-5.5 object-contain opacity-90 transition-opacity group-hover:opacity-100"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {certification.issuer}
                    </span>
                  </div>

                  {certification.verified && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300/90 backdrop-blur-sm">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors duration-200">
                  {certification.name}
                </h3>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle/50 flex items-center justify-between">
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${certification.buttonLabel}: ${certification.name} by ${certification.issuer}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted transition-colors hover:text-accent group/link"
                >
                  <span>{certification.buttonLabel}</span>
                  <ArrowUpRight
                    size={14}
                    className="text-text-muted transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent"
                  />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

