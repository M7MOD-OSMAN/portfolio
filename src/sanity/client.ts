import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * `null` until a project id is set, which lets the loaders fall back to the
 * bundled content instead of constructing a client that can only ever 404.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // The CDN serves cached, slightly-stale responses. Next's own fetch cache
      // sits in front of it, so this is purely about origin load.
      useCdn: true,
      perspective: "published",
    })
  : null;
