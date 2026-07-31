export type TechStackGroup = { title: string; items: readonly string[] };

/** Kept separate from the presentation so this section can move to a marquee without changing its content model. */
export const techStackGroups = [
  { title: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { title: "Backend", items: ["Node.js", "Express", "REST APIs", "System design"] },
  { title: "AI", items: ["LLM workflows", "Python", "Prompt engineering", "RAG"] },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "Supabase", "Redis"] },
  { title: "Tools", items: ["Git", "Docker", "Vercel", "Figma"] },
] as const satisfies readonly TechStackGroup[];
