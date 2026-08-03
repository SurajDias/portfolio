import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, Code2, Mail } from "lucide-react";
import Container from "../components/common/Container";
import TopologyGraph from "../components/visuals/TopologyGraph";
import Button from "../components/ui/Button";
import { EMAIL, LINKEDIN_URL, RESUME_URL } from "../config/site";

const badges = ["Open to internships", "AI", "Linux", "Full Stack"];

function ArchitecturePanel() {
  return (
    <motion.div initial={{ opacity: 0, scale: .975, x: 16 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: .18, duration: .8, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[620px]">
      <TopologyGraph />
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="flex min-h-[min(900px,100svh)] items-center pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-14">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[.22em] text-sky-300"><span className="h-px w-8 bg-sky-400" /> Software Engineer</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .72, ease: [0.22, 1, 0.36, 1] }} className="text-5xl font-semibold leading-[.98] tracking-[-.06em] text-slate-50 sm:text-6xl lg:text-7xl">Suraj Dias</motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .62, ease: [0.22, 1, 0.36, 1] }} className="mt-6 max-w-md text-lg leading-8 text-slate-400 sm:text-xl">Building AI-powered systems,<br className="hidden sm:block" /> developer tools,<br className="hidden sm:block" /> and scalable web applications.</motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .55, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex flex-wrap gap-2">{badges.map((badge, index) => <span key={badge} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${index === 0 ? "border-emerald-400/20 bg-emerald-400/[.06] text-emerald-200" : "border-white/[.09] bg-white/[.025] text-slate-400"}`}>{badge}</span>)}</motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .36, duration: .55, ease: [0.22, 1, 0.36, 1] }} className="mt-9 flex flex-wrap gap-3"><Button href={RESUME_URL} target="_blank" rel="noopener noreferrer" ariaLabel="Open Suraj Dias resume PDF in a new tab; use the PDF viewer to download it">Download Resume <ArrowDownToLine size={16} /></Button><Button href="https://github.com/surajdias" variant="secondary">View GitHub <Code2 size={16} /></Button><Button href={LINKEDIN_URL} variant="secondary" target="_blank" rel="noopener noreferrer" ariaLabel="Open Suraj Dias LinkedIn profile in a new tab">LinkedIn <ArrowUpRight size={16} /></Button><a href="#contact" className="interactive-button inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-slate-400 hover:text-sky-200">Contact <ArrowUpRight size={15} /></a></motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} className="mt-11 flex items-center gap-2 text-xs text-slate-500"><Mail size={13} className="text-sky-400" /> {EMAIL}</motion.div>
          </div>
          <ArchitecturePanel />
        </div>
      </Container>
    </section>
  );
}
