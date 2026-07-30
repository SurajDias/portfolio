import { motion } from "framer-motion";
type Props = { eyebrow: string; title: string; description?: string };
export default function SectionHeading({ eyebrow, title, description }: Props) {
  return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .55 }} className="max-w-2xl"><p className="mb-4 text-[11px] font-medium uppercase tracking-[.2em] text-sky-300">{eyebrow}</p><h2 className="text-3xl font-semibold tracking-[-.04em] text-slate-100 sm:text-4xl">{title}</h2>{description && <p className="mt-4 text-base leading-7 text-slate-400">{description}</p>}</motion.div>;
}
