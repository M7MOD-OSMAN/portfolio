/**
 * Absolute base URL for canonical links, OG tags, and the sitemap.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL   - set this once a custom domain is live
 *   2. Vercel's production URL - populated automatically on Vercel
 *   3. localhost              - development fallback
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
