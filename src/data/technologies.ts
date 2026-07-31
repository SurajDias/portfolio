export type TechnologyCategory = "Frontend" | "Backend" | "AI" | "Databases" | "DevOps" | "Tools";

export type Technology = {
  name: string;
  category: TechnologyCategory;
  /** Official Simple Icons SVG, kept monochrome to fit the site's existing palette. */
  iconUrl: string;
};

const icon = (slug: string) => `https://cdn.simpleicons.org/${slug}/CBD5E1`;

export const technologyRows = [
  [
    { name: "React", category: "Frontend", iconUrl: icon("react") },
    { name: "TypeScript", category: "Frontend", iconUrl: icon("typescript") },
    { name: "Vite", category: "Tools", iconUrl: icon("vite") },
    { name: "Tailwind CSS", category: "Frontend", iconUrl: icon("tailwindcss") },
    { name: "Framer Motion", category: "Frontend", iconUrl: icon("framer") },
    { name: "Python", category: "AI", iconUrl: icon("python") },
    { name: "FastAPI", category: "Backend", iconUrl: icon("fastapi") },
    { name: "Docker", category: "DevOps", iconUrl: icon("docker") },
  ],
  [
    { name: "Linux", category: "DevOps", iconUrl: icon("linux") },
    { name: "Git", category: "Tools", iconUrl: icon("git") },
    { name: "MongoDB", category: "Databases", iconUrl: icon("mongodb") },
    { name: "MySQL", category: "Databases", iconUrl: icon("mysql") },
    { name: "Java", category: "Backend", iconUrl: icon("openjdk") },
    { name: "C", category: "Backend", iconUrl: icon("c") },
    { name: "Node.js", category: "Backend", iconUrl: icon("nodedotjs") },
    { name: "Express", category: "Backend", iconUrl: icon("express") },
  ],
] as const satisfies readonly (readonly Technology[])[];

export const technologies = technologyRows.flat();
