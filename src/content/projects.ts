import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "Almaidan",
    url: "https://almaidan.com/",
    description:
      "Real-time sports platform (similar to SofaScore) with live scores and match schedules powered by complex third-party API integrations.",
    highlights: [
      "Architected the frontend for sub-second live-data updates.",
      "Led API schema design with backend teams for highly optimized data structures.",
      "Built a full CMS and admin dashboard with multi-format content management (media, polls) and a granular RBAC permission system.",
    ],
    featured: true,
  },
  {
    name: "Skyloov",
    url: "https://www.skyloov.com/",
    description:
      "Modern real-estate platform for property discovery and management across the UAE: rich-media listings, dynamic search, and advanced filtering, built for scale and performance.",
    featured: true,
  },
  {
    name: "The Lighthouse (MV Group)",
    url: "https://www.mountainviewegypt.com/",
    description:
      "Client portal serving thousands of MV Group clients: personalized profile pages, a happiness survey with detailed chart results, activity booking, and online payments through Paymob. Built with Next.js (earlier version in React).",
    featured: true,
  },
  {
    name: "SpeakUp",
    description:
      "Secure internal complaints platform where employees can raise concerns about anyone — including the CEO — via messages, voice notes, and file attachments, audited by a neutral agency (IBS). React frontend with a PHP/MySQL backend.",
    featured: false,
  },
  {
    name: "Eyes and Birds",
    description:
      "Website for a Dubai real-estate broker: premium property portfolio focused on buying, renting, and investment.",
    featured: false,
  },
  // TODO(mahmoud): add a one-line description of your role/contribution for each
  // of the following before they can be shown on the site (no invented content).
  {
    name: "Paris Gallery",
    url: "https://www.parisgalleryme.com/",
    description: "",
    featured: false,
  },
  {
    name: "Alkhunaizan",
    url: "https://www.alkhunaizan.sa/",
    description: "",
    featured: false,
  },
  {
    name: "Innova Pharmacy",
    url: "https://innovapharmacy.com/",
    description: "",
    featured: false,
  },
  {
    name: "Qasr Alawani",
    url: "https://www.qasralawani.net/",
    description: "",
    featured: false,
  },
  {
    name: "SACO",
    url: "https://www.saco.sa/",
    description: "",
    featured: false,
  },
];

/** Projects ready to display (have a real description). */
export const visibleProjects = projects.filter((p) => p.description !== "");

export const featuredProjects = visibleProjects.filter((p) => p.featured);
