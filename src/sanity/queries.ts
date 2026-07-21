import { defineQuery } from "next-sanity";

/**
 * Projections mirror the interfaces in `src/content/types.ts` so CMS documents
 * and the bundled fallback content are interchangeable at the component level.
 */

export const projectsQuery = defineQuery(`
  *[_type == "project" && defined(description)] | order(order asc, name asc) {
    "id": _id,
    name,
    url,
    description,
    category,
    highlights,
    tech,
    "featured": coalesce(featured, false),
    image,
    "blurDataURL": image.asset->metadata.lqip
  }
`);

export const rolesQuery = defineQuery(`
  *[_type == "role"] | order(start desc) {
    "id": _id,
    company,
    location,
    title,
    start,
    "end": coalesce(end, null),
    "sideEngagement": coalesce(sideEngagement, false),
    "highlights": coalesce(highlights, []),
    "tech": coalesce(tech, [])
  }
`);

export const educationQuery = defineQuery(`
  *[_type == "education"] | order(end desc) {
    "id": _id,
    institution,
    degree,
    start,
    end
  }
`);

/** Singleton: the projection is an array so it shares the `load` helper. */
export const aboutQuery = defineQuery(`
  *[_type == "about"] | order(_updatedAt desc) [0...1] {
    "id": _id,
    "body": coalesce(body, []),
    backgroundWord
  }
`);

export const skillGroupsQuery = defineQuery(`
  *[_type == "skillGroup"] | order(order asc, label asc) {
    "id": _id,
    label,
    "items": coalesce(items, [])
  }
`);
