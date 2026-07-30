import { motion } from "framer-motion";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import TopologyGraph from "../components/visuals/TopologyGraph";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="top" className="flex min-h-[min(860px,100svh)] items-center pt-28 pb-16 sm:pt-32 lg:pt-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-12">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[.22em] text-sky-300"><span className="h-px w-8 bg-sky-400" /> Software Engineer</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .72, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.055em] text-slate-50 sm:text-6xl lg:text-7xl">Turning ideas into <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">production-ready</span> software.</motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .62, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">I design and ship reliable software systems—from considered user experiences to the backend architecture that makes them scale.</motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .55, ease: [0.22, 1, 0.36, 1] }} className="mt-9 flex flex-wrap gap-3">
              <Button href="#projects">View projects <ArrowUpRight size={16} /></Button>
              <Button href="/resume.pdf" variant="secondary">Download résumé <ArrowDownToLine size={16} /></Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }} className="mt-14 flex items-center gap-3 text-xs text-slate-500"><span className="h-8 w-px bg-white/15" /> Building with intent, measuring with clarity.</motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .975, x: 16 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: .18, duration: .8, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[590px] lg:mr-0"><motion.div aria-hidden="true" animate={{ opacity: [.55, .85, .55], scale: [1, 1.03, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -inset-8 -z-10 rounded-full bg-blue-600/10 blur-3xl" /><TopologyGraph /></motion.div>
        </div>
      </Container>
    </section>
  );
}
