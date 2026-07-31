import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

type Accent = "blue" | "violet" | "green" | "amber";
type Node = { id: string; label: string; detail: string; x: number; y: number; accent?: Accent };
type Architecture = {
  name: string;
  shortName: string;
  focus: string;
  nodes: Node[];
  links: readonly (readonly [string, string])[];
  packets: readonly (readonly [string, string, number])[];
};

const colors: Record<Accent, string> = {
  blue: "#38bdf8", violet: "#a78bfa", green: "#34d399", amber: "#fbbf24",
};

const architectures: Architecture[] = [
  {
    name: "AutoOps Pro", shortName: "AutoOps", focus: "Developer platform",
    nodes: [
      { id: "trigger", label: "Event Trigger", detail: "Captures a deployment, alert, or scheduled operation.", x: 72, y: 160 },
      { id: "workflow", label: "Workflow Engine", detail: "Validates intent and coordinates idempotent automation jobs.", x: 220, y: 88, accent: "blue" },
      { id: "api", label: "Control API", detail: "Role-aware service boundary for operators and integrations.", x: 238, y: 231, accent: "violet" },
      { id: "runner", label: "Job Runner", detail: "Executes isolated operational tasks with clear failure states.", x: 430, y: 91, accent: "green" },
      { id: "audit", label: "Audit Log", detail: "Records every action and outcome for reliable traceability.", x: 446, y: 231, accent: "amber" },
      { id: "ops", label: "Team Console", detail: "Returns live job status and actionable operational context.", x: 598, y: 158, accent: "blue" },
    ],
    links: [["trigger", "workflow"], ["trigger", "api"], ["workflow", "runner"], ["api", "runner"], ["api", "audit"], ["runner", "audit"], ["runner", "ops"], ["audit", "ops"]],
    packets: [["trigger", "workflow", 0], ["workflow", "runner", 1.1], ["runner", "audit", 2.2], ["audit", "ops", 3.2], ["api", "runner", 4.1]],
  },
  {
    name: "PlacementPilot AI", shortName: "PlacementPilot", focus: "AI career platform",
    nodes: [
      { id: "profile", label: "Candidate Profile", detail: "Collects resume, skills, goals, and application context.", x: 72, y: 160 },
      { id: "parser", label: "Profile Parser", detail: "Normalizes candidate signals into structured, usable context.", x: 214, y: 88, accent: "blue" },
      { id: "matcher", label: "Job Matcher", detail: "Compares profile evidence against opportunity requirements.", x: 246, y: 230, accent: "violet" },
      { id: "context", label: "Context Store", detail: "Retrieves relevant profile and job information for each review.", x: 436, y: 86, accent: "green" },
      { id: "ai", label: "AI Coach", detail: "Produces inspectable, targeted application guidance.", x: 440, y: 230, accent: "violet" },
      { id: "plan", label: "Action Plan", detail: "Delivers prioritized feedback the candidate can act on next.", x: 596, y: 157, accent: "blue" },
    ],
    links: [["profile", "parser"], ["profile", "matcher"], ["parser", "context"], ["matcher", "context"], ["matcher", "ai"], ["context", "ai"], ["ai", "plan"], ["context", "plan"]],
    packets: [["profile", "parser", 0], ["parser", "context", 1.1], ["context", "ai", 2.2], ["ai", "plan", 3.3], ["profile", "matcher", 4.1]],
  },
  {
    name: "MiniCompiler Studio", shortName: "MiniCompiler", focus: "Developer tooling",
    nodes: [
      { id: "editor", label: "Code Editor", detail: "Accepts source code and keeps each compiler stage visible.", x: 70, y: 160 },
      { id: "lexer", label: "Lexer", detail: "Converts source text into a stream of meaningful tokens.", x: 205, y: 88, accent: "blue" },
      { id: "parser", label: "Parser", detail: "Builds an abstract syntax tree from the token sequence.", x: 242, y: 231, accent: "violet" },
      { id: "semantic", label: "Semantic Check", detail: "Validates scopes, types, and language-level constraints.", x: 430, y: 88, accent: "amber" },
      { id: "codegen", label: "Code Generator", detail: "Transforms the verified tree into executable output.", x: 442, y: 230, accent: "green" },
      { id: "output", label: "Output Panel", detail: "Shows generated output and stage-level diagnostics.", x: 598, y: 158, accent: "blue" },
    ],
    links: [["editor", "lexer"], ["editor", "parser"], ["lexer", "parser"], ["parser", "semantic"], ["semantic", "codegen"], ["parser", "codegen"], ["semantic", "output"], ["codegen", "output"]],
    packets: [["editor", "lexer", 0], ["lexer", "parser", 1.1], ["parser", "semantic", 2.2], ["semantic", "codegen", 3.3], ["codegen", "output", 4.2]],
  },
];

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

export default function TopologyGraph() {
  const reducedMotion = useReducedMotion();
  const [architectureIndex, setArchitectureIndex] = useState(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const architecture = architectures[architectureIndex];
  const nodesById = useMemo(() => new Map(architecture.nodes.map((node) => [node.id, node])), [architecture]);
  const active = activeNode ? nodesById.get(activeNode) : null;

  useEffect(() => setActiveNode(null), [architectureIndex]);

  return (
    <div className="relative isolate w-full overflow-hidden rounded-[1.75rem] border border-sky-200/[.14] bg-[#0a1120]/85 shadow-[0_28px_70px_rgba(0,0,0,.32)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-sky-100/25" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(56,189,248,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.045)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative border-b border-white/[.07] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.18em] text-slate-500">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 motion-safe:animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            Architecture showcase
          </div>
          <span className="font-mono text-[10px] tracking-wide text-slate-600">SYSTEM / {architecture.shortName.toUpperCase()}</span>
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto pb-0.5" role="tablist" aria-label="Project architectures">
          {architectures.map((item, index) => <button key={item.name} role="tab" aria-selected={index === architectureIndex} onClick={() => setArchitectureIndex(index)} className={`shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-medium transition-colors duration-300 ${index === architectureIndex ? "bg-sky-400/10 text-sky-200" : "text-slate-500 hover:bg-white/[.04] hover:text-slate-300"}`}>{item.name}</button>)}
        </div>
      </div>

      <div className="relative px-3 pb-2 pt-5 sm:px-5">
        <svg viewBox="0 0 666 310" className="h-auto w-full overflow-visible" role="img" aria-label={`${architecture.name} software architecture. Hover or focus a stage for details.`}>
          <g fill="none" stroke="#38bdf8" strokeOpacity=".16" strokeWidth="1.2">
            {architecture.links.map(([from, to]) => { const a = nodesById.get(from)!; const b = nodesById.get(to)!; return <motion.line key={`${from}-${to}`} initial={false} animate={{ x1: a.x, y1: a.y, x2: b.x, y2: b.y }} transition={transition} />; })}
          </g>
          <g fill="none" stroke="#7dd3fc" strokeOpacity=".32" strokeWidth="1.2" strokeDasharray="3 9">
            {architecture.links.map(([from, to]) => { const a = nodesById.get(from)!; const b = nodesById.get(to)!; return <motion.line key={`dash-${from}-${to}`} initial={false} animate={{ x1: a.x, y1: a.y, x2: b.x, y2: b.y }} transition={transition} />; })}
          </g>
          {!reducedMotion && architecture.packets.map(([from, to, delay], index) => { const a = nodesById.get(from)!; const b = nodesById.get(to)!; return <motion.g key={`${architectureIndex}-${from}-${to}-${index}`} initial={{ x: a.x, y: a.y, opacity: 0 }} animate={{ x: [a.x, b.x], y: [a.y, b.y], opacity: [0, 1, 1, 0] }} transition={{ duration: 3.4, delay, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }} style={{ willChange: "transform" }}><circle r="3" fill="#bae6fd" /><circle r="6" fill="#38bdf8" fillOpacity=".11" /></motion.g>; })}
          {architecture.nodes.map((node, index) => {
            const accent = colors[node.accent ?? "blue"]; const selected = activeNode === node.id;
            return <motion.g key={`stage-${index}`} initial={false} animate={{ x: node.x, y: node.y, opacity: 1 }} transition={transition} tabIndex={0} role="button" aria-label={`${node.label}: ${node.detail}`} className="cursor-help outline-none" onMouseEnter={() => setActiveNode(node.id)} onMouseLeave={() => setActiveNode(null)} onFocus={() => setActiveNode(node.id)} onBlur={() => setActiveNode(null)} style={{ willChange: "transform" }}>
              <motion.circle r="31" fill="none" stroke={accent} strokeWidth="1" animate={reducedMotion ? { opacity: 0.2 } : { opacity: [.13, .42, .13], scale: [1, 1.13, 1] }} transition={{ duration: 3.8, delay: index * .22, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }} />
              <circle r="23" fill="#0c1728" stroke={accent} strokeOpacity={selected ? ".85" : ".42"} strokeWidth="1.2" />
              <circle r="5" fill={accent} />
              <text y="45" textAnchor="middle" fill={selected ? "#e0f2fe" : "#94a3b8"} fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui" letterSpacing="1">{node.label.toUpperCase()}</text>
            </motion.g>;
          })}
          {active && <g pointerEvents="none" transform={`translate(${Math.min(active.x + 20, 445)} ${active.y < 150 ? active.y + 30 : active.y - 72})`}><rect width="196" height="48" rx="7" fill="#08111f" stroke="#334155" /><text x="12" y="19" fill="#e2e8f0" fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui">{active.label}</text><text x="12" y="35" fill="#94a3b8" fontSize="9" fontFamily="ui-sans-serif, system-ui">{active.detail}</text></g>}
        </svg>
      </div>

      <div className="relative grid grid-cols-3 gap-2 border-t border-white/[.07] px-5 py-4 sm:px-6">
        {[['03', 'projects'], ['Full stack + AI', 'tech stack'], [architecture.focus, 'primary focus']].map(([value, label]) => <div key={label}><p className="font-mono text-sm font-semibold text-slate-100">{value}</p><p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">{label}</p></div>)}
      </div>
    </div>
  );
}
