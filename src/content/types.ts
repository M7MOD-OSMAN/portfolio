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
  /** Public path to the portrait photo (under /public). */
  portraitSrc: string;
  socials: SocialLink[];
  languages: Language[];
}

export interface Role {
  /** Sanity document id. Absent on bundled fallback content. */
  id?: string;
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
  /** Sanity document id. Absent on bundled fallback content. */
  id?: string;
  institution: string;
  degree: string;
  start: string;
  end: string;
}

export interface Project {
  /** Sanity document id. Absent on bundled fallback content. */
  id?: string;
  name: string;
  url?: string;
  /** What the project is and what Mahmoud built/led. */
  description: string;
  highlights?: string[];
  tech?: string[];
  /** Featured projects get case-study treatment on the site. */
  featured: boolean;
  /**
   * Screenshot of the live site: a path under /public for bundled content, or
   * a Sanity CDN URL once the project is managed in the CMS.
   */
  image?: string;
  /** Tiny base64 preview from Sanity's image metadata (CMS content only). */
  blurDataURL?: string;
}

export interface SkillGroup {
  /** Sanity document id. Absent on bundled fallback content. */
  id?: string;
  label: string;
  items: string[];
}
