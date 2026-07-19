# Mahmoud Othman — Portfolio

Personal portfolio of Mahmoud Othman, Frontend Engineer. Built with Next.js
(App Router), TypeScript, and Tailwind CSS. Deployed on Vercel.

## Development

```bash
npm install
npm run dev     # local dev server
npm run build   # production build
npm run lint    # eslint
```

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
