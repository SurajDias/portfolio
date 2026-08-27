export type FeaturedProject = {
  name: string;
  type: string;
  problem: string;
  architecture: string;
  stack: readonly string[];
  decisions: string;
  accent: string;
  repoUrl?: string;
};

/** The single source of truth for work shown in the portfolio. */
export const featuredProjects = [
  { name: "AutoOps Pro", type: "Developer platform", problem: "Operational work lived across disconnected tools, slowing incident response and routine delivery.", architecture: "Event-driven orchestration layer with role-aware workflows and observable service boundaries.", stack: ["React", "Node.js", "PostgreSQL", "Docker"], decisions: "Designed idempotent job execution and clear failure states so automation stays trustworthy under load.", accent: "from-blue-500/35", repoUrl: "https://github.com/SurajDias/AutoOps-Pro" },
  { name: "PlacementPilot AI", type: "AI product", problem: "Job seekers needed feedback that was specific, practical, and available at the moment of application.", architecture: "Retrieval-informed AI workflow that turns profile context into structured, actionable guidance.", stack: ["TypeScript", "Python", "OpenAI", "Supabase"], decisions: "Made evaluation outputs inspectable, so recommendations read as a useful system—not a black box.", accent: "from-sky-500/30", repoUrl: "https://github.com/SurajDias/placement-pilot-ai" },
  { name: "MiniCompiler Studio", type: "Developer tooling", problem: "Compiler concepts are hard to explore when the full pipeline stays invisible to learners.", architecture: "Interactive compiler pipeline with discrete lexical, parsing, semantic, and codegen stages.", stack: ["React", "TypeScript", "AST", "Monaco"], decisions: "Kept each transformation independently observable to make complex internals easier to reason about.", accent: "from-indigo-500/30", repoUrl: "https://github.com/SurajDias/MiniCompilerStudio" },
  { name: "Customer Churn Intelligence", type: "Data intelligence", problem: "Retention signals were present in product data but unavailable to teams making day-to-day decisions.", architecture: "Analytics workflow connecting behavioral features, model scoring, and decision-ready reporting.", stack: ["Python", "SQL", "Power BI", "Scikit-learn"], decisions: "Balanced model performance with explainability so insights lead directly to intervention.", accent: "from-cyan-500/25", repoUrl: "https://github.com/SurajDias/Customer-Churn-Prediction" },
] as const satisfies readonly FeaturedProject[];
