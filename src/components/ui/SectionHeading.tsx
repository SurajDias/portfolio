import { motion } from "motion/react";
import { fadeUp } from "../../lib/motion-variants";
type Props = { eyebrow: string; title: string; description?: string };
export default function SectionHeading({ eyebrow, title, description }: Props) {
  return <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, margin: "-100px" }} className="max-w-2xl"><p className="mb-4 text-[11px] font-medium uppercase leading-4 tracking-[.2em] text-sky-300">{eyebrow}</p><h2 className="text-3xl font-semibold leading-tight tracking-[-.04em] text-slate-100 sm:text-4xl">{title}</h2>{description && <p className="mt-5 text-base leading-7 text-slate-400">{description}</p>}</motion.div>;
}
