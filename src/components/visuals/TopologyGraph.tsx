import { motion } from "framer-motion";
import { useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

type Node = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  accent?: "blue" | "violet" | "green";
};

const nodes: Node[] = [
  { id: "browser", label: "Browser", detail: "Client delivery and user interaction", x: 72, y: 164 },
  { id: "react", label: "React", detail: "Typed application interface and state", x: 214, y: 88 },
  { id: "fastapi", label: "FastAPI", detail: "API boundary, orchestration, and validation", x: 286, y: 226, accent: "blue" },
  { id: "models", label: "AI Models", detail: "Inference workloads and response generation", x: 456, y: 76, accent: "violet" },
  { id: "docker", label: "Docker", detail: "Repeatable builds and service runtime", x: 458, y: 222, accent: "green" },
  { id: "database", label: "Database", detail: "Persistent data, indexing, and retrieval", x: 594, y: 148, accent: "blue" },
];

const links = [
  ["browser", "react"], ["browser", "fastapi"], ["react", "fastapi"], ["fastapi", "models"],
  ["fastapi", "docker"], ["fastapi", "database"], ["docker", "database"], ["models", "database"],
] as const;

const packets = [
  ["browser", "react", 0], ["react", "fastapi", 1.1], ["fastapi", "models", 2.3],
  ["database", "fastapi", 3.1], ["fastapi", "docker", 4.2],
] as const;

const colors = { blue: "#38bdf8", violet: "#a78bfa", green: "#34d399" };

export default function TopologyGraph() {
  const reducedMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const findNode = (id: string) => nodes.find((node) => node.id === id)!;
  const active = activeNode ? findNode(activeNode) : null;

  return (
    <div className="relative isolate w-full overflow-hidden rounded-[1.75rem] border border-sky-200/[.14] bg-[#0a1120]/85 shadow-[0_28px_70px_rgba(0,0,0,.32)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-sky-100/25" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(56,189,248,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.045)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex items-center justify-between border-b border-white/[.07] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.18em] text-slate-500">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 motion-safe:animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
          Production topology
        </div>
        <span className="font-mono text-[10px] tracking-wide text-slate-600">SYSTEM / LIVE</span>
      </div>

      <div className="relative px-3 pb-2 pt-5 sm:px-5">
        <svg viewBox="0 0 666 310" className="h-auto w-full overflow-visible" role="img" aria-label="Production service topology showing Browser, React, FastAPI, AI Models, Docker, and Database.">
          <g fill="none" stroke="#38bdf8" strokeOpacity=".16" strokeWidth="1.2">
            {links.map(([from, to]) => {
              const a = findNode(from); const b = findNode(to);
              return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}
          </g>
          {links.map(([from, to]) => {
            const a = findNode(from); const b = findNode(to);
            return <line key={`dash-${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#7dd3fc" strokeOpacity=".32" strokeWidth="1.2" strokeDasharray="3 9" />;
          })}
          {!reducedMotion && packets.map(([from, to, delay], index) => {
            const a = findNode(from); const b = findNode(to);
            return <motion.g key={`${from}-${to}-${index}`} initial={{ x: a.x, y: a.y, opacity: 0 }} animate={{ x: [a.x, b.x], y: [a.y, b.y], opacity: [0, 1, 1, 0] }} transition={{ duration: 3.6, delay, repeat: Infinity, ease: "linear", repeatDelay: 1.4 }}>
              <circle r="3" fill="#bae6fd" />
              <circle r="6" fill="#38bdf8" fillOpacity=".11" />
            </motion.g>;
          })}
          {nodes.map((node, index) => {
            const accent = colors[node.accent ?? "blue"];
            const selected = activeNode === node.id;
            return <g key={node.id} tabIndex={0} role="button" aria-label={`${node.label}: ${node.detail}`} className="cursor-help outline-none" onMouseEnter={() => setActiveNode(node.id)} onMouseLeave={() => setActiveNode(null)} onFocus={() => setActiveNode(node.id)} onBlur={() => setActiveNode(null)}>
              <motion.circle cx={node.x} cy={node.y} r="31" fill="none" stroke={accent} strokeWidth="1" animate={reducedMotion ? undefined : { opacity: [.13, .42, .13], scale: [1, 1.13, 1] }} transition={{ duration: 3.8, delay: index * .26, repeat: Infinity, ease: "easeInOut" }} />
              <circle cx={node.x} cy={node.y} r="23" fill="#0c1728" stroke={accent} strokeOpacity={selected ? ".85" : ".42"} strokeWidth="1.2" />
              <circle cx={node.x} cy={node.y} r="5" fill={accent} />
              <text x={node.x} y={node.y + 45} textAnchor="middle" fill={selected ? "#e0f2fe" : "#94a3b8"} fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui" letterSpacing="1">{node.label.toUpperCase()}</text>
            </g>;
          })}
          {active && <g pointerEvents="none" transform={`translate(${Math.min(active.x + 20, 445)} ${active.y < 150 ? active.y + 30 : active.y - 72})`}>
            <rect width="196" height="48" rx="7" fill="#08111f" stroke="#334155" />
            <text x="12" y="19" fill="#e2e8f0" fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui">{active.label}</text>
            <text x="12" y="35" fill="#94a3b8" fontSize="9" fontFamily="ui-sans-serif, system-ui">{active.detail}</text>
          </g>}
        </svg>
      </div>

      <div className="relative grid grid-cols-3 gap-2 border-t border-white/[.07] px-5 py-4 sm:px-6">
        {[['99.98%', 'availability'], ['42 ms', 'p95 latency'], ['12.4k', 'req / min']].map(([value, label]) => <div key={label}><p className="font-mono text-sm font-semibold text-slate-100">{value}</p><p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">{label}</p></div>)}
      </div>
    </div>
  );
}
