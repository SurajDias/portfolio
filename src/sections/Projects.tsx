import { ArrowUpRight, GitBranch, Layers3 } from "lucide-react";
import { motion, useMotionValue } from "motion/react";
import { type PointerEvent } from "react";
import { fadeUp } from "../lib/motion-variants";
import Container from "../components/common/Container";
import SectionHeading from "../components/ui/SectionHeading";
import ArchitecturePreview from "../components/visuals/ArchitecturePreview";
import { featuredProjects } from "../data/projects";
import useReducedMotion from "../hooks/useReducedMotion";

export default function Projects() { return <motion.section id="projects" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, margin: "-100px" }} className="py-24 sm:py-32"><Container><SectionHeading eyebrow="Selected work" title="Engineering case studies, not just interfaces." description="A selection of systems shaped around useful constraints: clarity, resilience, performance, and the people who operate them." /><div className="mt-14 divide-y divide-white/[.09] border-y border-white/[.09]">{featuredProjects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div></Container></motion.section>; }

function ProjectCard({ project, index }: { project: typeof featuredProjects[number]; index: number }) {
  const reducedMotion = useReducedMotion();
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    spotlightX.set(event.clientX - bounds.left - 144);
    spotlightY.set(event.clientY - bounds.top - 144);
  };

  const spotlightHandlers = reducedMotion ? {} : {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => { moveSpotlight(event); spotlightOpacity.set(1); },
    onPointerMove: moveSpotlight,
    onPointerLeave: () => spotlightOpacity.set(0),
  };

  return <article {...spotlightHandlers} className="project-card relative isolate grid gap-7 overflow-hidden py-10 lg:grid-cols-[.85fr_1.35fr] lg:gap-16 lg:py-14">{!reducedMotion && <motion.div aria-hidden="true" style={{ x: spotlightX, y: spotlightY, opacity: spotlightOpacity }} className="pointer-events-none absolute left-0 top-0 z-0 h-72 w-72 rounded-full bg-sky-400/[.12] blur-3xl will-change-transform" />}<div className="relative z-10"><p className="text-xs font-medium uppercase tracking-[.16em] text-sky-300">0{index + 1} / {project.type}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.035em] text-slate-100">{project.name}</h3><ArchitecturePreview label={project.name} index={index} /></div><div className="relative z-10 flex flex-col justify-between"><div className="grid gap-6 sm:grid-cols-2"><Detail label="Problem">{project.problem}</Detail><Detail label="Architecture">{project.architecture}</Detail><Detail label="Engineering decision" className="sm:col-span-2">{project.decisions}</Detail></div><div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3"><div className="flex flex-wrap gap-2">{project.stack.map(s => <span key={s} className="rounded border border-white/[.09] bg-white/[.025] px-2.5 py-1 text-xs text-slate-400">{s}</span>)}</div><div className="ml-auto flex flex-wrap gap-x-3 gap-y-2 text-xs"><span aria-label={`${project.name} private repository`} className="inline-flex items-center gap-1.5 rounded px-1 py-1 text-slate-400"><GitBranch size={15}/> Private repository</span><span aria-label={`${project.name} demo unavailable`} className="inline-flex items-center gap-1.5 rounded px-1 py-1 text-slate-500"><ArrowUpRight size={15}/> Demo unavailable</span></div></div></div></article>;
}
function Detail({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <div className={className}><p className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.16em] text-slate-500"><Layers3 size={12} className="text-sky-400"/>{label}</p><p className="text-sm leading-6 text-slate-400">{children}</p></div>; }
