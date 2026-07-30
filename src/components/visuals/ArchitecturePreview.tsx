import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";

type Props = { accent: string; label: string; index: number };

/** A lightweight system diagram used in the project case-study preview area. */
export default function ArchitecturePreview({ accent, label, index }: Props) {
  const reducedMotion = useReducedMotion();
  const offsets = ["24%", "43%", "65%"];

  return (
    <div className={`group/preview relative mt-7 aspect-[16/9] overflow-hidden rounded-lg border border-white/[.08] bg-gradient-to-br ${accent} to-[#0b1220]`}>
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: reducedMotion ? 0 : 0.7, delay: index * 0.06 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-4 rounded border border-white/[.08] bg-[#09111e]/25" />
        <div className="absolute left-7 top-7 h-2 w-20 rounded-full bg-white/20" />
        <div className="absolute left-7 top-12 h-1.5 w-12 rounded-full bg-white/[.08]" />
        <div className="absolute bottom-7 left-7 right-7 grid grid-cols-[.9fr_1.25fr_.75fr] items-center gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="relative h-11 rounded border border-white/[.08] bg-white/[.045]">
              <i className="absolute left-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-sky-300/70" />
              <i className="absolute left-2.5 top-6 h-1.5 w-7 rounded-full bg-white/[.15]" />
              {item < 2 && <span className="absolute -right-3 top-1/2 h-px w-3 bg-sky-300/25" />}
            </div>
          ))}
        </div>
        {!reducedMotion && offsets.map((left, item) => (
          <motion.i
            key={left}
            className="absolute top-[68%] h-1.5 w-1.5 rounded-full bg-sky-200 shadow-[0_0_8px_rgba(125,211,252,.9)]"
            style={{ left }}
            animate={{ x: [0, 24, 0], opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 2.8 + item * 0.25, delay: item * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
      <span className="absolute bottom-3 right-4 text-[9px] uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover/preview:text-slate-300">{label} architecture</span>
    </div>
  );
}
