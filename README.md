# Mahmoud Othman — Portfolio

Personal portfolio of Mahmoud Othman, Frontend Engineer. Built with Next.js
(App Router), TypeScript, and Tailwind CSS. Deployed on Vercel.

## Development

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev     # local dev server
npm run build   # production build
npm run lint    # eslint
```

## Environment

The contact form sends through [Resend](https://resend.com). Set `RESEND_API_KEY`
in `.env.local` for local work, and add the same variable in the Vercel project
settings for deployments. `CONTACT_FROM_EMAIL` defaults to Resend's shared
`onboarding@resend.dev` sender, which delivers only to the Resend account
owner's address; point it at your own verified domain when you have one.

## Structure

- `src/app/` — App Router pages and layout.
- `src/content/` — **the single source of truth for all personal content**
  (profile, experience, projects, skills). Edit these files to update the site;
  components never hardcode personal data.
- `docs/` — project analysis, design audit, and content notes driving the build.
- `legacy/` — the original site this project started from
  ([elliottprogrammer.com](https://github.com/elliottprogrammer/elliottprogrammer.com)
  by Bryan Elliott), kept temporarily as an engineering reference during the
  rebuild. It will be removed once the migration is complete.
