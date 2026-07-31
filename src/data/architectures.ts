export type ArchitectureAccent = "blue" | "violet" | "green" | "amber";

export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  accent?: ArchitectureAccent;
};

export type ProjectArchitecture = {
  name: string;
  shortName: string;
  focus: string;
  nodes: readonly ArchitectureNode[];
  links: readonly (readonly [string, string])[];
  packets: readonly (readonly [string, string, number])[];
};

const pipelineLinks = [
  ["metrics", "api"], ["api", "anomaly"], ["anomaly", "root-cause"], ["root-cause", "prediction"], ["prediction", "dashboard"],
] as const;

export const AutoOpsProArchitecture = {
  name: "AutoOps Pro",
  shortName: "AutoOps",
  focus: "Predictive operations",
  nodes: [
    { id: "metrics", label: "Metrics Generator", detail: "Streams operational signals for analysis.", x: 72, y: 160 },
    { id: "api", label: "FastAPI Backend", detail: "Validates requests and serves the analysis workflow.", x: 210, y: 88, accent: "blue" },
    { id: "anomaly", label: "Anomaly Detection", detail: "Detects unusual behaviour before incidents escalate.", x: 245, y: 231, accent: "violet" },
    { id: "root-cause", label: "Root Cause Analysis", detail: "Traces anomalous signals to likely failure sources.", x: 430, y: 88, accent: "amber" },
    { id: "prediction", label: "Failure Prediction", detail: "Estimates risk so teams can act early.", x: 442, y: 230, accent: "green" },
    { id: "dashboard", label: "Dashboard", detail: "Presents live health, alerts, and recommendations.", x: 598, y: 158, accent: "blue" },
  ],
  links: pipelineLinks,
  packets: [["metrics", "api", 0], ["api", "anomaly", 1.1], ["anomaly", "root-cause", 2.2], ["root-cause", "prediction", 3.3], ["prediction", "dashboard", 4.2]],
} as const satisfies ProjectArchitecture;

export const PlacementPilotArchitecture = {
  name: "PlacementPilot AI",
  shortName: "PlacementPilot",
  focus: "Resume intelligence",
  nodes: [
    { id: "upload", label: "Resume Upload", detail: "Receives a candidate resume for evaluation.", x: 72, y: 160 },
    { id: "parser", label: "Resume Parser", detail: "Converts resume content into structured candidate data.", x: 210, y: 88, accent: "blue" },
    { id: "skills", label: "Skill Extraction", detail: "Identifies skills, experience, and strengths.", x: 245, y: 231, accent: "violet" },
    { id: "ats", label: "ATS Analysis", detail: "Measures alignment with applicant tracking criteria.", x: 430, y: 88, accent: "amber" },
    { id: "roadmap", label: "Roadmap Generator", detail: "Builds a focused plan to close skill gaps.", x: 442, y: 230, accent: "green" },
    { id: "interview", label: "Interview Preparation", detail: "Creates targeted practice from the candidate profile.", x: 598, y: 158, accent: "blue" },
  ],
  links: [["upload", "parser"], ["parser", "skills"], ["skills", "ats"], ["ats", "roadmap"], ["roadmap", "interview"]],
  packets: [["upload", "parser", 0], ["parser", "skills", 1.1], ["skills", "ats", 2.2], ["ats", "roadmap", 3.3], ["roadmap", "interview", 4.2]],
} as const satisfies ProjectArchitecture;

export const MiniCompilerArchitecture = {
  name: "MiniCompiler Studio",
  shortName: "MiniCompiler",
  focus: "Compiler education",
  nodes: [
    { id: "source", label: "Source Code", detail: "Accepts code for step-by-step compilation.", x: 72, y: 160 },
    { id: "lexer", label: "Lexer", detail: "Converts source text into meaningful tokens.", x: 210, y: 88, accent: "blue" },
    { id: "parser", label: "Parser", detail: "Builds a syntax tree from the token stream.", x: 245, y: 231, accent: "violet" },
    { id: "ast", label: "AST Generation", detail: "Produces the program structure used by later stages.", x: 430, y: 88, accent: "amber" },
    { id: "semantic", label: "Semantic Analysis", detail: "Checks types, scopes, and language rules.", x: 442, y: 230, accent: "green" },
    { id: "codegen", label: "Code Generation", detail: "Transforms the verified program into output code.", x: 598, y: 158, accent: "blue" },
  ],
  links: [["source", "lexer"], ["lexer", "parser"], ["parser", "ast"], ["ast", "semantic"], ["semantic", "codegen"]],
  packets: [["source", "lexer", 0], ["lexer", "parser", 1.1], ["parser", "ast", 2.2], ["ast", "semantic", 3.3], ["semantic", "codegen", 4.2]],
} as const satisfies ProjectArchitecture;

export const projectArchitectures = [AutoOpsProArchitecture, PlacementPilotArchitecture, MiniCompilerArchitecture] as const;
