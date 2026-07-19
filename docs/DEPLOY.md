# Deploying to Vercel (free / Hobby tier)

The Hobby plan covers everything this site needs, including custom domains and
HTTPS. Nothing here requires a paid plan.

## 1. Import the repo

1. Go to <https://vercel.com/new> (signed in as `m7modosman`).
2. Import `M7MOD-OSMAN/portfolio` from GitHub.
3. Leave every build setting on the default. Vercel detects Next.js and uses
   `next build` automatically.

Importing from GitHub (rather than uploading files) means every push to `main`
redeploys automatically, and pull requests get their own preview URL.

## 2. Add environment variables

In the project's **Settings > Environment Variables**, add:

| Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | your Resend key | Required for the contact form |
| `CONTACT_FROM_EMAIL` | `Portfolio <onboarding@resend.dev>` | Optional; this is the default |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain` | Only once a custom domain is attached |

Without `RESEND_API_KEY`, the site still builds and runs. The contact form
degrades gracefully and points visitors at the direct email and social links.

`NEXT_PUBLIC_SITE_URL` can be left unset at first: the site falls back to
Vercel's own production URL for canonical links, Open Graph tags, and the
sitemap, so those stay correct either way.

## 3. Domain

The free tier gives `<project-name>.vercel.app`. Naming the Vercel project
`mahmoudothman` produces <https://mahmoudothman.vercel.app>, which carries the
name at no cost.

For a true custom domain, buy one from any registrar (roughly $10-14/year;
`mahmoudothman.com` is already taken, `mahmoudothman.dev` and
`mahmoud-othman.com` were available at the time of writing), then add it under
**Settings > Domains**. Attaching a domain and its TLS certificate is free on
the Hobby plan; only the registration costs money.

After attaching a domain, set `NEXT_PUBLIC_SITE_URL` to it and redeploy so the
canonical tag, OG tags, and sitemap point at the final address.

## 4. After the first deploy

- Run Lighthouse against the live URL (the CDN result is the meaningful one,
  not localhost).
- Submit the sitemap in [Google Search Console](https://search.google.com/search-console)
  and verify the Person schema with the
  [Rich Results Test](https://search.google.com/test/rich-results).
- Send a test message through the contact form to confirm the production
  Resend key works.
