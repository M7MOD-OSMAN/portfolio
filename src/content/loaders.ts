import "server-only";

import { cache } from "react";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/client";
import { CONTENT_TAG, revalidateSeconds } from "@/sanity/env";
import { cardImageUrl } from "@/sanity/image";
import {
  educationQuery,
  projectsQuery,
  rolesQuery,
  skillGroupsQuery,
} from "@/sanity/queries";

import { education as fallbackEducation, roles as fallbackRoles } from "./experience";
import { projects as fallbackProjects } from "./projects";
import { skillGroups as fallbackSkillGroups } from "./skills";
import type { Education, Project, Role, SkillGroup } from "./types";

/**
 * The CMS is the source of truth, but every loader falls back to the content
 * bundled in this folder. That keeps the site rendering before Sanity is set
 * up, and keeps it up if Sanity is unreachable at build or request time.
 *
 * An empty result is treated as "not configured yet" rather than "the owner
 * deleted everything", since a blank Experience or Skills section is far more
 * likely to be a misconfiguration than an intentional edit.
 */
async function load<T>(
  label: string,
  query: string,
  fallback: T[],
): Promise<{ data: T[]; fromCms: boolean }> {
  if (!client) return { data: fallback, fromCms: false };

  try {
    const result = await client.fetch<T[]>(
      query,
      {},
      { next: { revalidate: revalidateSeconds, tags: [CONTENT_TAG] } },
    );

    if (!result || result.length === 0) {
      console.warn(
        `[content] Sanity returned no ${label}; using bundled content.`,
      );
      return { data: fallback, fromCms: false };
    }

    return { data: result, fromCms: true };
  } catch (error) {
    console.error(`[content] Failed to load ${label} from Sanity.`, error);
    return { data: fallback, fromCms: false };
  }
}

/** Raw project as it comes back from GROQ, before the image is resolved. */
type ProjectDocument = Omit<Project, "image" | "blurDataURL"> & {
  image?: SanityImageSource;
  blurDataURL?: string;
};

export const getProjects = cache(async (): Promise<Project[]> => {
  const { data, fromCms } = await load<ProjectDocument>(
    "projects",
    projectsQuery,
    // Fallback entries already carry `/public` paths, so they skip resolution.
    fallbackProjects as unknown as ProjectDocument[],
  );

  if (!fromCms) return data as unknown as Project[];

  return data.map((project) => ({
    ...project,
    image: cardImageUrl(project.image),
  }));
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
});

export const getOtherProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((project) => !project.featured);
});

export const getRoles = cache(async (): Promise<Role[]> => {
  const { data } = await load<Role>("roles", rolesQuery, fallbackRoles);
  return data;
});

/** The role with no end date, used for "Currently at …" copy. */
export const getCurrentRole = cache(async (): Promise<Role | undefined> => {
  const roles = await getRoles();
  return roles.find((role) => role.end === null);
});

export const getEducation = cache(async (): Promise<Education[]> => {
  const { data } = await load<Education>(
    "education",
    educationQuery,
    fallbackEducation,
  );
  return data;
});

export const getSkillGroups = cache(async (): Promise<SkillGroup[]> => {
  const { data } = await load<SkillGroup>(
    "skill groups",
    skillGroupsQuery,
    fallbackSkillGroups,
  );
  return data;
});
