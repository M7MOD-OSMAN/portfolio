import type { Education, Role } from "./types";

/** Newest first. Primary timeline: Mountain View → Skyloov → V4Tech (current). */
export const roles: Role[] = [
  {
    company: "V4Tech",
    location: "Riyadh, Saudi Arabia",
    title: "Senior Frontend Engineer",
    start: "2025-10",
    end: null,
    highlights: [
      "Architected and led scalable micro-frontend solutions across SaaS and e-commerce platforms using Next.js, improving component independence and deployment speed.",
      "Established a centralized reusable component library and design system with Storybook/Chromatic, reducing average development cycle time by 15%.",
      "Drove performance initiatives — code splitting, ISR, and advanced data-fetching strategies — achieving up to 40% faster load times and top Core Web Vitals scores.",
      "Led technical discovery and integration planning with UI/UX and backend teams, defining API contracts and data-flow strategies.",
      "Spearheaded TypeScript adoption and mentored 2 junior developers through formalized code review and pair programming.",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Micro-frontends",
      "Storybook",
      "Chromatic",
    ],
  },
  {
    company: "Avenzoar",
    location: "Jordan",
    title: "Senior Frontend Developer",
    start: "2025-06",
    end: "2025-11",
    sideEngagement: true,
    highlights: [
      "Built a full learning platform for a well-known Jordanian YouTuber: course subscriptions and payments, student enrollment, lessons and progress tracking, plus an admin dashboard for courses, content, users, payments, and analytics — scalable, secure, and optimized for high traffic.",
    ],
    tech: ["React", "Next.js"],
  },
  {
    company: "Skyloov",
    location: "Dubai, UAE",
    title: "Senior Frontend Engineer",
    start: "2025-01",
    end: "2025-10",
    highlights: [
      "Led architecture, development, and deployment of scalable, high-performance web applications using React and Next.js.",
      "Collaborated with UX/UI designers and backend teams on REST/GraphQL API design and data-flow optimization.",
      "Automated CI/CD pipelines (GitHub Actions, Jenkins) and testing (Jest, Cypress) to improve release efficiency.",
    ],
    tech: ["React", "Next.js", "GraphQL", "GitHub Actions", "Jest", "Cypress"],
  },
  {
    company: "Mountain View (MV Group)",
    location: "Egypt",
    title: "Frontend Developer",
    start: "2022-08",
    end: "2024-12",
    highlights: [
      "Developed and maintained responsive, user-friendly web applications using HTML, CSS, and JavaScript (React/Next.js).",
      "Collaborated with designers and backend developers to implement UI/UX improvements and integrate APIs.",
      "Optimized web performance, accessibility, and cross-browser compatibility.",
    ],
    tech: ["React", "Next.js", "JavaScript", "HTML", "CSS"],
  },
];

export const education: Education[] = [
  {
    institution: "Mansoura University",
    degree: "Computer Science Engineering",
    start: "2014-10",
    end: "2019-05",
  },
];
