/**
 * Sanity connection settings.
 *
 * These are intentionally non-throwing: when the project isn't configured yet
 * the content loaders fall back to the bundled files in `src/content`, so the
 * site still builds and renders. See `src/content/loaders.ts`.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Pin the API to a date so query behaviour can't change under us. */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-01";

/** A project id is the one value with no sensible default. */
export const isSanityConfigured = projectId !== "";

/** How long (seconds) a cached CMS response is served before revalidating. */
export const revalidateSeconds = 60;

/** Cache tag used by the revalidation webhook to purge CMS content. */
export const CONTENT_TAG = "sanity-content";
