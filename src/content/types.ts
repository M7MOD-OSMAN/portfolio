export interface SocialLink {
  label: string;
  href: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Profile {
  name: string;
  /** Short display title used in the hero and page titles. */
  title: string;
  location: string;
  email: string;
  phone: string;
  /** One-paragraph professional summary. */
  summary: string;
  socials: SocialLink[];
  languages: Language[];
}

export interface Role {
  company: string;
  location: string;
  title: string;
  /** ISO month, e.g. "2025-10". */
  start: string;
  /** null = current role. */
  end: string | null;
  /** true for side/contract engagements running alongside a primary role. */
  sideEngagement?: boolean;
  highlights: string[];
  tech: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start: string;
  end: string;
}

export interface Project {
  name: string;
  url?: string;
  /** What the project is and what Mahmoud built/led. */
  description: string;
  highlights?: string[];
  tech?: string[];
  /** Featured projects get case-study treatment on the site. */
  featured: boolean;
}

export interface SkillGroup {
  label: string;
  items: string[];
}
