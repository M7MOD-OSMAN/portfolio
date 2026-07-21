# Sanity CMS

Projects, experience (roles + education), and skills are managed in Sanity.
The profile block (name, title, portrait, socials, languages) is still authored
in `src/content/profile.ts`.

## How content resolves

Every section reads through the loaders in `src/content/loaders.ts`, which:

1. Query Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set.
2. Fall back to the bundled files in `src/content/` when it isn't set, when the
   query fails, or when it returns zero documents.

That fallback is why the site builds and renders before Sanity exists, and why
a Sanity outage can't take the portfolio down. An empty result is treated as
"not set up yet" rather than "everything was deleted", since a blank Experience
section is far more likely to be misconfiguration than an intentional edit.

## First-time setup

1. **Create a project** at <https://sanity.io/manage> (or `npx sanity login`
   then `npx sanity init`). Note the project id.

2. **Add environment variables** to `.env.local`:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=your-editor-token   # seeding only
   SANITY_REVALIDATE_SECRET=any-random-string
   ```

   Create the write token under **API > Tokens** with the **Editor** role. It is
   only used by the seed script, never at runtime.

3. **Allow the Studio origin.** Under **API > CORS origins**, add
   `http://localhost:3000` (and your production domain) with credentials
   allowed. Without this the embedded Studio can't authenticate.

4. **Import the existing content:**

   ```bash
   npm run sanity:seed -- --dry   # preview what would be written
   npm run sanity:seed            # write it
   ```

   Documents use deterministic ids, so re-running updates them in place instead
   of creating duplicates. Screenshots in `public/images/projects/` are uploaded
   as Sanity image assets; the script reuses an existing asset when one with the
   same filename is already present.

5. **Edit at `/studio`** — locally at <http://localhost:3000/studio>, and at
   `https://<your-domain>/studio` once deployed.

Add the same variables (except `SANITY_API_WRITE_TOKEN`) to the Vercel project
settings before deploying.

## Content model

| Type         | Notes                                                              |
| ------------ | ------------------------------------------------------------------ |
| `project`    | `order` sorts the list; the first `featured` one is the lead card.  |
| `role`       | Sorted newest first by `start`. Leave `end` empty for current role. |
| `education`  | Shown under the experience timeline.                                |
| `skillGroup` | `order` sorts the groups; the first group is visually emphasised.   |

Dates are `YYYY-MM` strings (e.g. `2025-10`), which is what `formatRange` in
`src/lib/date.ts` expects. The schema enforces the format.

Project screenshots use a hotspot: the CDN URL is generated at a fixed 1200×750
crop, so the hotspot decides what survives the crop rather than the browser
always trimming from the centre.

## Caching and revalidation

Queries are cached with `next: { revalidate: 60, tags: ["sanity-content"] }`,
so edits appear within a minute on their own.

For instant updates, add a webhook in Sanity under **API > Webhooks**:

- **URL**: `https://<your-domain>/api/revalidate`
- **Dataset**: `production`
- **Trigger on**: create, update, delete
- **Secret**: the same value as `SANITY_REVALIDATE_SECRET`

The handler verifies the signature and calls
`revalidateTag("sanity-content", "max")`, which marks the content stale and
serves stale-while-revalidate so no visitor waits on a blocking refetch.

## Removing the fallback

The bundled content is a safety net, not a second source of truth. Once Sanity
holds everything and you're happy with it, `src/content/{projects,experience,skills}.ts`
can be deleted along with the fallback arms in `loaders.ts`. Keep
`profile.ts` and `types.ts`.
