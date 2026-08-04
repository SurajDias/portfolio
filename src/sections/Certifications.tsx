import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import { certifications } from "../data/certifications";
import { fadeUp } from "../lib/motion-variants";

export default function Certifications() {
  return (
    <motion.section id="certifications" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, margin: "-100px" }} className="border-y border-white/[.07] bg-[#0b1220]/45 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Credentials"
          title="Foundational learning, independently verified."
          description="A focused record of coursework that supports the systems and products I build."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {certifications.map((certification) => (
            <article
              key={certification.name}
              className="certification-card flex min-h-56 flex-col rounded-xl border border-white/[.09] bg-white/[.025] p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[.08] bg-[#050816]/60">
                    <img src={certification.issuerLogoUrl} alt="" aria-hidden="true" width="22" height="22" loading="lazy" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">{certification.issuer}</p>
                </div>
                {certification.verified && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium uppercase tracking-[.14em] text-sky-300">
                    <BadgeCheck size={14} aria-hidden="true" /> Verified
                  </span>
                )}
              </div>
              <h3 className="mt-7 text-lg font-medium leading-6 tracking-[-.02em] text-slate-100">{certification.name}</h3>
              <Button
                href={certification.credentialUrl}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${certification.buttonLabel}: ${certification.name} by ${certification.issuer}`}
                className="mt-auto w-fit px-3.5 py-2 text-xs"
              >
                {certification.buttonLabel} <ArrowUpRight size={15} aria-hidden="true" />
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
