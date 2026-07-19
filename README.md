# Mahmoud Othman — Portfolio

Personal portfolio of Mahmoud Othman, Frontend Engineer. Built with Next.js
(App Router), TypeScript, and Tailwind CSS. Deployed on Vercel.

## Development

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev        # local dev server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run sanity:seed -- --dry   # preview a CMS import from src/content
```

## Environment

The contact form sends through [Resend](https://resend.com). Set `RESEND_API_KEY`
in `.env.local` for local work, and add the same variable in the Vercel project
settings for deployments. `CONTACT_FROM_EMAIL` defaults to Resend's shared
`onboarding@resend.dev` sender, which delivers only to the Resend account
owner's address; point it at your own verified domain when you have one.

Projects, experience, and skills are managed in Sanity — see
[docs/SANITY.md](docs/SANITY.md) for project setup, seeding the existing
content, and wiring up the revalidation webhook. Until
`NEXT_PUBLIC_SANITY_PROJECT_ID` is set, the site renders the content bundled in
`src/content/`.

## Structure

- `src/app/` — App Router pages and layout. The public site lives in the
  `(site)` route group; `/studio` hosts the embedded Sanity Studio.
- `src/content/` — the content layer. `profile.ts` is authored here; projects,
  experience, and skills come from Sanity through `loaders.ts`, falling back to
  the files in this folder when the CMS isn't configured or is unreachable.
  Components never hardcode personal data.
- `src/sanity/` — CMS client, schemas, queries, and image helpers.
- `docs/` — project analysis, design audit, and content notes driving the build.
- `legacy/` — the original site this project started from
  ([elliottprogrammer.com](https://github.com/elliottprogrammer/elliottprogrammer.com)
  by Bryan Elliott), kept temporarily as an engineering reference during the
  rebuild. It will be removed once the migration is complete.
