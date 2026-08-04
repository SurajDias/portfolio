import { useEffect, useMemo, useState } from "react";
import { projectArchitectures, type ArchitectureAccent, type ProjectArchitecture } from "../../data/architectures";
import { featuredProjects } from "../../data/projects";
import useReducedMotion from "../../hooks/useReducedMotion";

const colors: Record<ArchitectureAccent, string> = {
  blue: "#38bdf8", violet: "#a78bfa", green: "#34d399", amber: "#fbbf24",
};

export default function TopologyGraph() {
  const reducedMotion = useReducedMotion();
  const [architectureIndex, setArchitectureIndex] = useState(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const architecture: ProjectArchitecture = projectArchitectures[architectureIndex];
  const nodesById = useMemo(() => new Map(architecture.nodes.map((node) => [node.id, node])), [architecture]);
  const active = activeNode ? nodesById.get(activeNode) : null;
  const isActiveLink = (from: string, to: string) => activeNode === from || activeNode === to;

  useEffect(() => setActiveNode(null), [architectureIndex]);

  return (
    <div className="relative isolate w-full overflow-hidden rounded-[1.75rem] border border-sky-200/[.14] bg-[#0a1120]/85 shadow-[0_28px_70px_rgba(0,0,0,.32)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-sky-100/25" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(56,189,248,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.045)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative border-b border-white/[.07] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.18em] text-slate-500">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 motion-safe:animate-ping motion-reduce:animate-none" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            Architecture showcase
          </div>
          <span className="font-mono text-[10px] tracking-wide text-slate-600">SYSTEM / {architecture.shortName.toUpperCase()}</span>
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto pb-0.5" role="tablist" aria-label="Project architectures">
          {projectArchitectures.map((item, index) => <button type="button" id={`architecture-tab-${index}`} key={item.name} role="tab" aria-controls="architecture-panel" aria-selected={index === architectureIndex} onClick={() => setArchitectureIndex(index)} onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); const nextIndex = (index + (event.key === "ArrowRight" ? 1 : projectArchitectures.length - 1)) % projectArchitectures.length; setArchitectureIndex(nextIndex); document.getElementById(`architecture-tab-${nextIndex}`)?.focus(); }} className={`interactive-button shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${index === architectureIndex ? "bg-sky-400/[.14] text-sky-100 shadow-[inset_0_0_0_1px_rgba(125,211,252,.18)]" : "text-slate-500 opacity-70 hover:bg-white/[.04] hover:text-slate-300 hover:opacity-100"}`}>{item.name}</button>)}
        </div>
      </div>

      <div id="architecture-panel" role="tabpanel" aria-labelledby={`architecture-tab-${architectureIndex}`} className="relative px-3 pb-2 pt-5 sm:px-5">
        <svg viewBox="0 0 666 310" className="h-auto w-full overflow-visible" role="img" aria-label={`${architecture.name} software architecture. Hover or focus a stage for details.`}>
          <g fill="none" stroke="#38bdf8" strokeOpacity=".16" strokeWidth="1.2">
            {architecture.links.map(([from, to]) => { const a = nodesById.get(from)!; const b = nodesById.get(to)!; return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity={isActiveLink(from, to) ? .52 : activeNode ? .08 : .16} />; })}
          </g>
          <g fill="none" stroke="#7dd3fc" strokeOpacity=".32" strokeWidth="1.2" strokeDasharray="3 9">
            {architecture.links.map(([from, to]) => { const a = nodesById.get(from)!; const b = nodesById.get(to)!; return <line key={`dash-${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity={isActiveLink(from, to) ? .72 : activeNode ? .12 : .32} />; })}
          </g>
          {!reducedMotion && architecture.packets.map(([from, to], index) => { const b = nodesById.get(to)!; return <g key={`${architectureIndex}-${from}-${to}-${index}`} transform={`translate(${b.x} ${b.y})`} opacity=".85"><circle r="2.6" fill="#e0f2fe" /><circle r="5.5" fill="#38bdf8" fillOpacity=".13" /></g>; })}
          {architecture.nodes.map((node, index) => {
            const accent = colors[node.accent ?? "blue"]; const selected = activeNode === node.id;
            return <g key={`stage-${index}`} transform={`translate(${node.x} ${node.y}) scale(${selected ? 1.045 : 1})`} tabIndex={0} role="button" aria-label={`${node.label}: ${node.detail}`} className="cursor-help outline-none" onMouseEnter={() => setActiveNode(node.id)} onMouseLeave={() => setActiveNode(null)} onFocus={() => setActiveNode(node.id)} onBlur={() => setActiveNode(null)} onClick={() => setActiveNode(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveNode(node.id); } }}>
              <circle r="31" fill="none" stroke={accent} strokeWidth="1" opacity={reducedMotion ? .2 : .28} />
              <circle r="23" fill="#0c1728" stroke={accent} strokeOpacity={selected ? ".85" : ".42"} strokeWidth="1.2" />
              <circle r="5" fill={accent} />
              <text y="45" textAnchor="middle" fill={selected ? "#e0f2fe" : "#94a3b8"} fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui" letterSpacing="1">{node.label.toUpperCase()}</text>
            </g>;
          })}
          {active && <g pointerEvents="none" transform={`translate(${Math.min(active.x + 20, 445)} ${active.y < 150 ? active.y + 30 : active.y - 72})`}><rect width="196" height="48" rx="7" fill="#08111f" stroke="#334155" /><text x="12" y="19" fill="#e2e8f0" fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui">{active.label}</text><text x="12" y="35" fill="#94a3b8" fontSize="9" fontFamily="ui-sans-serif, system-ui">{active.detail}</text></g>}
        </svg>
      </div>

      <div className="relative grid grid-cols-3 gap-2 border-t border-white/[.07] px-5 py-4 sm:px-6">
        {[[String(featuredProjects.length).padStart(2, "0"), "projects"], ["Full stack + AI", "tech stack"], [architecture.focus, "primary focus"]].map(([value, label]) => <div key={label}><p className="font-mono text-sm font-semibold text-slate-100">{value}</p><p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">{label}</p></div>)}
      </div>
    </div>
  );
}
