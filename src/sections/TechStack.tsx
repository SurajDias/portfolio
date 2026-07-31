import { motion } from "framer-motion";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { techStackGroups } from "../data/tech-stack";

export default function TechStack() {
  return <section id="tech" className="border-y border-white/[.07] bg-[#0b1220]/45 py-24 sm:py-32"><Container><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><SectionHeading eyebrow="Capabilities" title="A practical, product-minded toolset." description="Technology is a means to a robust outcome. I choose tools for their fit with the system, team, and maintenance horizon." /><TechStackList /></div></Container></section>;
}

// This isolated renderer is the future replacement point for the tech marquee.
function TechStackList() {
  return <div className="grid gap-x-10 divide-y divide-white/[.08]">{techStackGroups.map(({ title, items }, i) => <motion.div key={title} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} className="grid gap-3 py-5 sm:grid-cols-[130px_1fr]"><h3 className="text-sm font-medium text-slate-200">{title}</h3><div className="flex flex-wrap gap-2">{items.map(item => <span key={item} className="rounded-md border border-white/[.08] bg-white/[.025] px-3 py-1.5 text-xs text-slate-400 transition hover:border-sky-400/30 hover:text-sky-200">{item}</span>)}</div></motion.div>)}</div>;
}
