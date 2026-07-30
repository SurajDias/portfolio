import { motion } from "framer-motion";
import { useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

const nodes = [
  { x: 56, y: 112, label: "edge" }, { x: 184, y: 54, label: "api" },
  { x: 206, y: 180, label: "auth" }, { x: 340, y: 82, label: "worker" },
  { x: 365, y: 220, label: "db" }, { x: 488, y: 135, label: "cache" },
];
const links = [[56,112,184,54], [56,112,206,180], [184,54,340,82], [206,180,340,82], [206,180,365,220], [340,82,488,135], [340,82,365,220], [365,220,488,135]];

export default function TopologyGraph() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative isolate w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b1220]/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />
      <div className="mb-7 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
        <span>Service topology</span><span className="flex items-center gap-1.5 text-emerald-300"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> all systems nominal</span>
      </div>
      <svg viewBox="0 0 545 274" className="w-full overflow-visible" role="img" aria-label="Animated service dependency topology. All services are healthy.">
        <defs>
          <linearGradient id="link" x1="0" x2="1"><stop stopColor="#38bdf8" stopOpacity=".16"/><stop offset="1" stopColor="#2563eb" stopOpacity=".55"/></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {links.map(([x1,y1,x2,y2], i) => <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#link)" strokeWidth="1.25" animate={reducedMotion ? undefined : { opacity: [.45, .9, .45] }} transition={{ duration: 3.6, delay: i * .18, repeat: Infinity }} />)}
        {!reducedMotion && links.slice(0, 5).map(([x1,y1,x2,y2], i) => <motion.circle key={`p${i}`} r="3" fill="#7dd3fc" filter="url(#glow)" initial={{ cx:x1, cy:y1, opacity:0 }} animate={{ cx:[x1,x2], cy:[y1,y2], opacity:[0,1,1,0] }} transition={{ duration: 2.8 + i*.35, delay:i*.55, repeat:Infinity, ease:"linear" }} />)}
        {nodes.map((node, i) => <g key={node.label} role="button" tabIndex={0} aria-label={`${node.label} service: healthy`} onMouseEnter={() => setActiveNode(i)} onMouseLeave={() => setActiveNode(null)} onFocus={() => setActiveNode(i)} onBlur={() => setActiveNode(null)}>
          <motion.circle cx={node.x} cy={node.y} r="17" fill="#0b1220" stroke="#38bdf8" strokeOpacity=".28" animate={reducedMotion ? undefined : { strokeOpacity:[.25,.6,.25], r: activeNode === i ? 19 : 17 }} transition={{ duration: activeNode === i ? .2 : 3, delay:i*.25, repeat: activeNode === i ? 0 : Infinity }} />
          <circle cx={node.x} cy={node.y} r="5" fill={i === 4 ? "#2563eb" : "#38bdf8"} />
          <text x={node.x} y={node.y+34} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="ui-sans-serif, system-ui" letterSpacing="1">{node.label.toUpperCase()}</text>
          {activeNode === i && <g pointerEvents="none"><rect x={node.x - 42} y={node.y - 47} width="84" height="19" rx="4" fill="#101a2b" stroke="#38bdf8" strokeOpacity=".35" /><text x={node.x} y={node.y - 34} textAnchor="middle" fill="#dbeafe" fontSize="8" fontFamily="ui-sans-serif, system-ui">HEALTHY · 99.98%</text></g>}
        </g>)}
      </svg>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-4">
        {[['99.98%','availability'],['42 ms','p95 latency'],['12.4k','req / min']].map(([value, label]) => <div key={label}><p className="text-sm font-semibold text-slate-100">{value}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</p></div>)}
      </div>
    </div>
  );
}
