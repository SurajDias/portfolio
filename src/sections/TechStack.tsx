import { motion } from "motion/react";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { technologies, technologyRows, type Technology } from "../data/technologies";
import { fadeUp } from "../lib/motion-variants";

export default function TechStack() {
  return <motion.section id="tech" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, margin: "-100px" }} className="border-y border-white/[.07] bg-[#0b1220]/45 py-24 sm:py-32"><Container><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><SectionHeading eyebrow="Capabilities" title="A practical, product-minded toolset." description="Technology is a means to a robust outcome. I choose tools for their fit with the system, team, and maintenance horizon." /><TechStackList /></div></Container></motion.section>;
}

function TechStackList() {
  return <div className="tech-marquees">
    <MarqueeRow items={technologyRows[0]} direction="left" className="max-md:hidden" />
    <MarqueeRow items={technologyRows[1]} direction="right" className="max-md:hidden" />
    <MarqueeRow items={technologies} direction="left" className="md:hidden" />
  </div>;
}

function MarqueeRow({ items, direction, className = "" }: { items: readonly Technology[]; direction: "left" | "right"; className?: string }) {
  return <div className={`tech-marquee ${className}`} tabIndex={0} aria-label="Technology marquee. Animation pauses while focused.">
    <div className={`tech-marquee__track tech-marquee__track--${direction}`}>
      <TechnologySet items={items} />
      <TechnologySet items={items} hidden />
    </div>
  </div>;
}

function TechnologySet({ items, hidden = false }: { items: readonly Technology[]; hidden?: boolean }) {
  return <div className="tech-marquee__set" aria-hidden={hidden || undefined}>{items.map((technology) => <div key={technology.name} className="tech-card" data-category={technology.category}><img src={technology.iconUrl} alt="" aria-hidden="true" width="20" height="20" loading="lazy" /><span>{technology.name}</span></div>)}</div>;
}
