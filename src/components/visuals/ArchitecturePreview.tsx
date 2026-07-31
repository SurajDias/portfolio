import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";

type Props = { label: string; index: number };
type Point = readonly [number, number];

const ink = "#7dd3fc";
const muted = "#64748b";
const surface = "#0d1726";
const packetTransition = (delay: number) => ({
  duration: 2.9,
  delay,
  repeat: Infinity,
  repeatDelay: 1.15,
  ease: "linear" as const,
});

function Packet({ points, delay, reducedMotion }: { points: readonly Point[]; delay: number; reducedMotion: boolean }) {
  if (reducedMotion) return null;
  return (
    <motion.circle
      r="2.1"
      fill="#e0f2fe"
      animate={{ cx: points.map(([x]) => x), cy: points.map(([, y]) => y), opacity: [0, 0.95, 0.95, 0] }}
      transition={packetTransition(delay)}
    />
  );
}

function Box({ x, y, width, label, active = false }: { x: number; y: number; width: number; label: string; active?: boolean }) {
  return <g>
    <rect x={x} y={y} width={width} height="27" rx="5" fill={surface} stroke={active ? ink : muted} strokeOpacity={active ? ".8" : ".55"} strokeWidth="1.1" />
    <text x={x + width / 2} y={y + 16.5} textAnchor="middle" fill={active ? "#e0f2fe" : "#cbd5e1"} fontSize="7.4" fontWeight="600" letterSpacing=".45">{label.toUpperCase()}</text>
  </g>;
}

function Dot({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r="9" fill={surface} stroke={active ? ink : muted} strokeOpacity={active ? ".85" : ".55"} strokeWidth="1.1" />
    <circle cx={x} cy={y} r="2" fill={active ? ink : "#94a3b8"} />
  </g>;
}

function AutoOps({ reducedMotion }: { reducedMotion: boolean }) {
  const links = "M72 65V84 M72 84H132 M72 84H191 M132 84V104 M191 84V104 M132 131V145H161 M191 131V145H161 M161 145V158";
  return <>
    <path d={links} fill="none" stroke={ink} strokeOpacity=".3" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M161 158V169" fill="none" stroke={ink} strokeOpacity=".72" strokeWidth="1.2" strokeLinecap="round" />
    <Box x={42} y={38} width={60} label="Metrics" active />
    <Box x={102} y={104} width={60} label="Anomaly" active />
    <Box x={161} y={104} width={60} label="Root cause" active />
    <Box x={131} y={169} width={60} label="Prediction" active />
    <Box x={255} y={92} width={63} label="Dashboard" active />
    <path d="M191 183H255V119" fill="none" stroke={ink} strokeOpacity=".72" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="42" y="26" fill="#64748b" fontSize="6.5" letterSpacing="1.1">OBSERVABILITY PIPELINE</text>
    <text x="260" y="78" fill="#64748b" fontSize="6.2" letterSpacing=".7">ACTIVE OUTPUT</text>
    <Packet points={[[72, 65], [72, 84], [132, 84], [132, 117], [161, 145], [161, 169], [191, 183], [255, 183], [255, 119]]} delay={0} reducedMotion={reducedMotion} />
    <Packet points={[[72, 65], [72, 84], [191, 84], [191, 117], [161, 145]]} delay={1.1} reducedMotion={reducedMotion} />
  </>;
}

function PlacementPilot({ reducedMotion }: { reducedMotion: boolean }) {
  const y = 104;
  return <>
    <path d="M65 104H91 M145 104H165 M219 104H239 M293 104H313" fill="none" stroke={ink} strokeOpacity=".56" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M145 104H165 M219 104H239" fill="none" stroke={ink} strokeOpacity=".2" strokeWidth="4" strokeLinecap="round" />
    <path d="M42 69h18l8 8v43H42z" fill={surface} stroke={ink} strokeOpacity=".8" strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M60 69v9h8 M48 87h13 M48 94h13 M48 101h9" fill="none" stroke={ink} strokeOpacity=".58" strokeWidth="1" strokeLinecap="round" />
    <text x="55" y="127" textAnchor="middle" fill="#e0f2fe" fontSize="7.2" fontWeight="600" letterSpacing=".4">RESUME PDF</text>
    <Box x={91} y={90} width={54} label="Parser" active />
    <Box x={165} y={90} width={54} label="Skill scan" active />
    <Box x={239} y={90} width={54} label="AI review" active />
    <g>
      <rect x="313" y="76" width="39" height="55" rx="5" fill={surface} stroke={ink} strokeOpacity=".8" strokeWidth="1.1" />
      <path d="M322 91h20M322 101h14M322 111h17" stroke={ink} strokeOpacity=".5" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="322" cy="91" r="1.5" fill={ink} />
    </g>
    <text x="332.5" y="143" textAnchor="middle" fill="#e0f2fe" fontSize="7.2" fontWeight="600" letterSpacing=".35">ROADMAP</text>
    <text x="42" y="56" fill="#64748b" fontSize="6.5" letterSpacing="1.1">CANDIDATE ANALYSIS</text>
    <Packet points={[[68, y], [91, y], [145, y], [165, y], [219, y], [239, y], [293, y], [313, y]]} delay={0} reducedMotion={reducedMotion} />
    <Packet points={[[68, y], [91, y], [145, y], [165, y], [219, y], [239, y], [293, y], [313, y]]} delay={1.55} reducedMotion={reducedMotion} />
  </>;
}

function MiniCompiler({ reducedMotion }: { reducedMotion: boolean }) {
  return <>
    <path d="M54 53V73H119V93 M54 73H185V93 M119 120V139H87V157 M119 139H151V157 M185 120V157" fill="none" stroke={ink} strokeOpacity=".5" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M185 120V139H268V157" fill="none" stroke={ink} strokeOpacity=".72" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <Box x={27} y={26} width={54} label="Source" active />
    <Dot x={119} y={106} active />
    <Dot x={185} y={106} active />
    <text x="119" y="131" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="600" letterSpacing=".4">LEXER</text>
    <text x="185" y="131" textAnchor="middle" fill="#e0f2fe" fontSize="7" fontWeight="600" letterSpacing=".4">PARSER</text>
    <g>
      <circle cx="87" cy="166" r="5" fill={surface} stroke={muted} strokeWidth="1" />
      <circle cx="151" cy="166" r="5" fill={surface} stroke={muted} strokeWidth="1" />
      <circle cx="185" cy="166" r="5" fill={surface} stroke={ink} strokeOpacity=".8" strokeWidth="1" />
      <circle cx="268" cy="166" r="5" fill={surface} stroke={ink} strokeOpacity=".8" strokeWidth="1" />
    </g>
    <text x="136" y="188" textAnchor="middle" fill="#94a3b8" fontSize="6.6" letterSpacing=".9">AST HIERARCHY</text>
    <Box x={282} y={153} width={57} label="Codegen" active />
    <text x="27" y="15" fill="#64748b" fontSize="6.5" letterSpacing="1.1">SYNTAX TREE BUILD</text>
    <Packet points={[[54, 53], [54, 73], [119, 73], [119, 106], [119, 139], [151, 139], [151, 166]]} delay={0} reducedMotion={reducedMotion} />
    <Packet points={[[54, 73], [185, 73], [185, 106], [185, 139], [268, 139], [268, 166], [282, 166]]} delay={1.35} reducedMotion={reducedMotion} />
  </>;
}

function Churn({ reducedMotion }: { reducedMotion: boolean }) {
  return <>
    <g fill={surface} stroke={muted} strokeOpacity=".65" strokeWidth="1.1">
      <rect x="31" y="67" width="52" height="64" rx="5" />
      <rect x="100" y="82" width="48" height="34" rx="5" />
      <rect x="165" y="82" width="58" height="34" rx="5" />
      <rect x="277" y="68" width="51" height="62" rx="5" />
    </g>
    <path d="M83 99H100 M148 99H165 M223 99H233 M269 99H277" fill="none" stroke={ink} strokeOpacity=".55" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M148 99H165 M223 99H233" fill="none" stroke={ink} strokeOpacity=".18" strokeWidth="4" strokeLinecap="round" />
    <path d="M40 80h34M40 90h34M40 100h34M40 110h21" stroke="#94a3b8" strokeOpacity=".42" strokeWidth="1" strokeLinecap="round" />
    <path d="M109 94h30M109 103h20M174 94h40M174 103h30" stroke={ink} strokeOpacity=".42" strokeWidth="1" strokeLinecap="round" />
    <circle cx="251" cy="99" r="18" fill={surface} stroke={ink} strokeOpacity=".8" strokeWidth="1.2" />
    <path d="M243 99l5 5 11-12" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M286 89h32M286 100h23M286 111h28" stroke={ink} strokeOpacity=".5" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="286" cy="89" r="1.5" fill={ink} />
    <text x="57" y="146" textAnchor="middle" fill="#cbd5e1" fontSize="7.2" fontWeight="600" letterSpacing=".4">DATASET</text>
    <text x="124" y="128" textAnchor="middle" fill="#cbd5e1" fontSize="7.2" fontWeight="600" letterSpacing=".35">CLEAN</text>
    <text x="194" y="128" textAnchor="middle" fill="#cbd5e1" fontSize="7.2" fontWeight="600" letterSpacing=".35">FEATURES</text>
    <text x="251" y="128" textAnchor="middle" fill="#e0f2fe" fontSize="7.2" fontWeight="600" letterSpacing=".35">MODEL</text>
    <text x="302.5" y="146" textAnchor="middle" fill="#e0f2fe" fontSize="6.6" fontWeight="600" letterSpacing=".25">DASHBOARD</text>
    <text x="31" y="54" fill="#64748b" fontSize="6.5" letterSpacing="1.1">ML SCORING WORKFLOW</text>
    <Packet points={[[83, 99], [100, 99], [148, 99], [165, 99], [223, 99], [233, 99], [269, 99], [277, 99]]} delay={0} reducedMotion={reducedMotion} />
    <Packet points={[[83, 99], [100, 99], [148, 99], [165, 99], [223, 99], [233, 99], [269, 99], [277, 99]]} delay={1.45} reducedMotion={reducedMotion} />
  </>;
}

/** A distinct, compact system diagram for each project case-study card. */
export default function ArchitecturePreview({ label, index }: Props) {
  const reducedMotion = useReducedMotion();
  let diagram = <AutoOps reducedMotion={reducedMotion} />;
  if (index === 1) diagram = <PlacementPilot reducedMotion={reducedMotion} />;
  if (index === 2) diagram = <MiniCompiler reducedMotion={reducedMotion} />;
  if (index === 3) diagram = <Churn reducedMotion={reducedMotion} />;

  return (
    <div className="project-preview group/preview relative mt-7 aspect-[16/9] overflow-hidden rounded-lg border border-white/[.08] bg-[#0b1220]">
      <motion.svg
        viewBox="0 0 360 202"
        initial={{ opacity: 0, scale: 1.02 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: reducedMotion ? 0 : 0.55, delay: index * 0.06 }}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`${label} architecture diagram`}
      >
        <path d="M18 18H342V184H18Z M18 45H342 M18 157H342" fill="none" stroke="#94a3b8" strokeOpacity=".12" strokeWidth="1" />
        {diagram}
      </motion.svg>
      <span className="absolute bottom-3 right-4 text-[9px] uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover/preview:text-slate-300">{label} architecture</span>
    </div>
  );
}
