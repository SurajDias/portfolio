import { ArrowDownToLine, ArrowUpRight, Code2, Mail } from "lucide-react";
import { motion } from "motion/react";
import Container from "../components/common/Container";
import ParticleSphere from "../components/common/ParticleSphere";
import TopologyGraph from "../components/visuals/TopologyGraph";
import Button from "../components/ui/Button";
import { EMAIL, LINKEDIN_URL, RESUME_URL } from "../config/site";
import { blueprintTransition, fadeUp, staggerContainer } from "../lib/motion-variants";

const badges = ["Open to internships", "AI", "Linux", "Full Stack"];

function ArchitecturePanel() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <TopologyGraph />
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[min(900px,100svh)] items-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-[-8%] z-[-1] h-[min(680px,88%)] w-[min(760px,76vw)] rounded-full bg-violet-500/[.075] blur-[110px]" />
      <ParticleSphere />
      <motion.div
        aria-hidden="true"
        animate={{ x: [-24, 24, -24], y: [-18, 18, -18] }}
        transition={blueprintTransition}
        className="pointer-events-none absolute inset-[-20%] z-0 opacity-[0.035] will-change-transform [background-image:radial-gradient(circle_at_center,rgba(56,189,248,.75),transparent_34%),linear-gradient(rgba(125,211,252,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.55)_1px,transparent_1px)] [background-size:auto,64px_64px,64px_64px]"
      />
      <div className="relative z-10 w-full">
        <Container>
          <div className="grid items-center gap-12 lg:translate-x-6 lg:grid-cols-[.88fr_1.12fr] lg:gap-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative isolate z-10 before:absolute before:-inset-x-6 before:-inset-y-7 before:-z-10 before:rounded-2xl before:border before:border-sky-200/[.10] before:bg-sky-400/[.035] before:shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_20px_48px_rgba(2,6,23,.30)] before:backdrop-blur-md sm:before:-inset-x-7">
            <motion.div variants={fadeUp}>
              <div className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[.22em] text-sky-300"><span className="h-px w-8 bg-sky-400" /> Software Engineer</div>
              <h1 className="text-5xl font-semibold leading-[.98] tracking-[-.055em] text-slate-50 sm:text-6xl lg:text-7xl">Suraj Dias</h1>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="mt-6 max-w-md text-lg leading-8 text-slate-400 sm:text-xl">Building AI-powered systems,<br className="hidden sm:block" /> developer tools,<br className="hidden sm:block" /> and scalable web applications.</p>
              <div className="mt-8 flex flex-wrap gap-2">{badges.map((badge, index) => <span key={badge} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${index === 0 ? "border-emerald-400/20 bg-emerald-400/[.06] text-emerald-200" : "border-white/[.09] bg-white/[.025] text-slate-400"}`}>{badge}</span>)}</div>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3"><Button className="transition-[background-color,box-shadow] duration-300 ease-out hover:shadow-[0_14px_30px_rgba(56,189,248,0.24)]" href={RESUME_URL} target="_blank" rel="noopener noreferrer" ariaLabel="Open Suraj Dias resume PDF in a new tab; use the PDF viewer to download it">Download Resume <ArrowDownToLine size={16} /></Button><Button className="transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:shadow-[0_12px_26px_rgba(14,116,144,0.14)]" href="https://github.com/surajdias" variant="secondary">View GitHub <Code2 size={16} /></Button><Button className="transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:shadow-[0_12px_26px_rgba(14,116,144,0.14)]" href={LINKEDIN_URL} variant="secondary" target="_blank" rel="noopener noreferrer" ariaLabel="Open Suraj Dias LinkedIn profile in a new tab">LinkedIn <ArrowUpRight size={16} /></Button><a href="#contact" className="interactive-button inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-slate-400 hover:text-sky-200">Contact <ArrowUpRight size={15} /></a></motion.div>
            <div className="mt-11 flex items-center gap-2 text-xs text-slate-500"><Mail size={13} className="text-sky-400" /> {EMAIL}</div>
          </motion.div>
          <ArchitecturePanel />
          </div>
        </Container>
      </div>
    </section>
  );
}
