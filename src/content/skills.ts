import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    label: "Core",
    items: [
      "TypeScript",
      "JavaScript (ES6+)",
      "React",
      "Next.js",
      "HTML5",
      "CSS3",
    ],
  },
  {
    label: "State & Data",
    items: ["Redux Toolkit", "React Query", "REST", "GraphQL"],
  },
  {
    label: "Styling & UI",
    items: ["Tailwind CSS", "Material UI", "Bootstrap", "Storybook"],
  },
  {
    label: "Engineering Practice",
    items: [
      "Micro-frontends",
      "Design systems",
      "CI/CD (GitHub Actions, Jenkins)",
      "Testing (Jest, Cypress)",
      "Performance & Core Web Vitals",
    ],
  },
  {
    label: "Leadership",
    items: [
      "Technical leadership",
      "Mentorship",
      "Stakeholder alignment",
      "Systems thinking",
    ],
  },
];
