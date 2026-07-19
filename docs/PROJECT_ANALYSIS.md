# Project Analysis — elliottprogrammer.com

> Phase 1 (Discovery) + Phase 2 (Design Audit) documentation.
> Generated 2026-07-19 as the foundation for the portfolio transformation project.

---

## 1. What this project actually is

This repository is **not a framework project**. It is a fully hand-crafted, single-page,
zero-build static website — the personal portfolio of Bryan Elliott (@elliottprogrammer),
a Senior Full-Stack Engineer formerly at Automattic. It is deployed on **Netlify** with
three serverless functions providing dynamic behavior.

There is **no Next.js, no React, no TypeScript, no bundler, no build step**. The
`package.json` dependencies exist *only* for the serverless functions (LangChain, OpenAI,
Supabase, Netlify Blobs). The entire frontend is:

| File | Lines | Role |
|---|---|---|
| `index.html` | 1,120 | The entire site — every section, inline SVGs, markup |
| `styles.css` | 3,249 | All styling, one file, no methodology (BEM-ish ad hoc) |
| `main.js` | 2,378 | All behavior, one `DOMContentLoaded` closure, ES module |
| `image-atomizer.js` | 818 | Custom canvas particle engine (typed arrays + OffscreenCanvas worker) |
| `atomizer-worker.js` | ~500 | Web Worker for off-main-thread particle rendering |
| `starfield.js` | 483 | Custom canvas starfield + procedural nebulas + comet |
| `elliottprogrammer-level-up-game.js` | 739 | Custom canvas platformer mini-game (sprite sheets, audio) |
| `image-frame-cycler.js` / `-v2.js` | ~150 | Sprite-frame cycling utility (blinking eyes, typing hands, fan) |
| `t-writer.js` | ~350 | Vendored typewriter library (MIT, ChrisCavs/t-writer.js) |
| `confettea.js` | ~250 | Custom confetti effect |
| `utils.js` | ~330 | Device-type detection, sizing helpers, debounce |
| `service-worker.js` | ~70 | Caches the git-contributions API response |

**Runtime dependencies are loaded from CDNs at runtime** (no local copies in use):
GSAP 3.13 + ScrollTrigger + CustomEase + CustomBounce + MotionPathPlugin (cdnjs/jsdelivr),
Lenis 1.3.8 smooth-scroll (unpkg), Google Calendar scheduling widget, Google Analytics (gtag),
`Impact` webfont (cdnfonts.com) and `WF Visual Sans` variable font (a CloudFront URL).
Local copies of both fonts exist in `/fonts` but are **not referenced** by the CSS.

## 2. Architecture map

```
Browser
 ├─ index.html  (single page, 9 content sections + footer)
 ├─ styles.css  (design tokens partially GitHub-copied, desktop-first media queries)
 ├─ main.js     (all interactivity; imports the custom modules below)
 │    ├─ Starfield        → <canvas #starfield>  (hero background)
 │    ├─ ImageAtomizer    → <canvas .atomizer>   (hero portrait → particles on hover)
 │    │    └─ atomizer-worker.js (OffscreenCanvas rendering)
 │    ├─ Typewriter       → hero intro text
 │    ├─ imageFrameCycler → blinking eyes, typing hands, ceiling fan frames
 │    ├─ LevelUpGame      → <canvas #canvas> platformer (sprites + audio)
 │    └─ confettea        → celebration effects
 ├─ service-worker.js (cache layer for /.netlify/functions/git-contributions)
 └─ GSAP + Lenis from CDN

Netlify
 ├─ functions/elliott-ai.js            POST → SSE stream (RAG chatbot)
 │    └─ elliott-ai/query-vector-store.mjs
 │         ├─ OpenAI text-embedding-3-small (1536-dim)
 │         ├─ Supabase pgvector `match_documents` RPC  (semantic)
 │         ├─ Supabase `documents` table ILIKE keyword fallback (lexical)
 │         └─ gpt-4o-mini streaming completion
 ├─ functions/git-contributions.js     GET → reads Netlify Blobs store
 ├─ functions/update-git-contributions-cron.js  @daily → GitHub GraphQL → Blobs
 └─ Netlify Forms ("elliottprogrammer-contact") for the contact form

Content pipeline (offline, run manually)
 └─ elliott-ai/chunk-files.mjs  → chunks elliott-ai/documents/*.md → embeddings → Supabase
```

**Required environment variables:** `OPENAI_API_KEY`, `SUPABASE_URL`,
`SUPABASE_SECRET_API_KEY`, `GITHUB_PAT`.
**Hardcoded external identities:** Netlify `siteID: eca3c870-…` in `git-contributions.js`,
GA tag `G-D67B4TQYY3`, Google Calendar scheduling URL, GitHub username `elliottprogrammer`
in the cron function, dev-only dotenv path `/Users/bryan/Projects/…` in `query-vector-store.mjs`.

## 3. Page structure (routing = none; one page, 9 sections)

| # | Section id | Content | Interactive centerpiece |
|---|---|---|---|
| 1 | `#image-atomizer` (hero) | Name, title, tagline | Portrait dissolves into particles on hover (mouse-force physics); starfield + comet behind; typewriter text; "View on GitHub" credit |
| 2 | `#about-me` | Bio (Automattic, WordPress.com/Jetpack inline SVG logos, fishing story + magazine-cover `<dialog>`) | Desk scene: light switch toggles scene lighting, blinking eyes + typing hands sprite cycles, hidden-coffee "challenge" with sounds + confetti |
| 3 | `#what-sets-me-apart` | Craftsmanship / detail-oriented pitch | Bug-hunting scene: fan switch + light switch, animated fan frames, a bug crawls out; clicking it completes a "challenge" |
| 4 | `#make-impact` | Stack Overflow credibility (top 9%, 284k reached) | Replica SO profile card; count-up stat animations on scroll |
| 5 | `#open-source` | Automattic OSS story (215 + 342 + 76 + 133 PR stats) | Replica GitHub profile card; live 6-year contribution graph (cron + Blobs + service worker) with play/pause year slider |
| 6 | `#leveling-up` | Growth mindset copy + blog link | Playable canvas platformer; jump between levels; audio + celebration banner |
| 7 | `#experience` | 4 jobs, 2010–2025, tech badges | Scroll-driven rotating "globe" — company buildings rotate into view as a sprite character walks backwards through career history |
| 8 | `#elliott-ai` | "Ask me anything" RAG chatbot | Chat card w/ streaming SSE answers, example questions; resume download link |
| 9 | `#contact` | Book-a-call (Google Calendar), Netlify contact form, mailto | Tilting logo emblem whose eyes follow the cursor; drag/tap to tilt |
| — | `footer` | Blog, LinkedIn, X, GitHub, StackOverflow, prog.ai links | — |

Every section also has a giant scroll-parallax **background text effect** (`.bg-text-effect`,
e.g. "About Me", "Impact", "Level Up") animated along an SVG motion path.

## 4. Styling system

- **Tokens:** A `:root` block exists but is a *partial, borrowed* token set — many variables
  are copied verbatim from GitHub's design system (`--fgColor-accent`, `--borderRadius-full`,
  etc.) to style the replica GitHub/SO profile cards. There is no systematic spacing,
  type, or color scale of its own.
- **Typography:** Body font is **Impact** (a condensed display face) for *everything* —
  headings, body copy, UI. `WF Visual Sans` is loaded but scarcely used. Base size 18px,
  sizes in mixed `em`/`px`, no fluid type scale.
- **Layout:** Ad-hoc `.two-col` / `.grid-two-col` classes, `.page-container` max-width
  wrapper. Heavy absolute positioning inside interactive scenes (necessary for the art).
- **Media queries:** Desktop-first `max-width` breakpoints at 1245/1024/700/645/500/400/350,
  plus a separate battery of `max-height` and orientation queries just for the rotating-globe
  experience section. Mobile is an afterthought correction layer.
- **Dark only.** There is no theming; colors are hardcoded (`#0b0b11` background etc.).
  No light mode, no `prefers-color-scheme`.

## 5. Animation system

- **GSAP everywhere:** ~60+ tweens/timelines in `main.js`. ScrollTrigger drives section
  reveals, background-text motion paths, stat count-ups, and the globe rotation
  (scrubbed, pinned). `ScrollTrigger.normalizeScroll(true)` + **Lenis** for smooth scroll.
- **Canvas engines:** starfield (rAF), atomizer (typed arrays, optional worker), game (rAF).
- **Sprite animation:** frame-cycler swaps `.frame-visible` among stacked `<img>` frames
  (eyes blinking, hands typing, fan spinning) on randomized timers.
- **Audio:** Web Audio API buffers (clicks, squish, ta-da, crowd cheer) tied to interactions.
- **No `prefers-reduced-motion` handling anywhere** (0 matches in HTML/CSS/JS).

## 6. State management & data flow

- No state library, no store. State lives in closure variables inside `main.js` and DOM
  attributes/classes. Cross-feature coordination via direct DOM queries.
- Data fetches: `git-contributions` (service-worker cached; note `STALE_AFTER_MS = 1` — the
  24h cache is effectively **disabled**, a leftover debug value), `elliott-ai` (SSE POST),
  Netlify Forms via URL-encoded POST + inline success/error message.

## 7. SEO

- Title, OG and Twitter cards present with absolute image URL. ✔
- **No `<meta name="description">`** (only `og:description`). ✘
- No canonical, no `robots.txt`, no `sitemap.xml`, **no structured data** (Person schema
  is a big miss for a portfolio). ✘
- Single `<h1>`… actually **no `<h1>` at all** — the name is a `<div class="name">`;
  headings start at `h2`, with skips to `h4`/`h5`. ✘
- No `lang`-verified content structure; `<html lang="en">` ✔. Missing `<!DOCTYPE html>`
  declaration risk — verify (file starts at `<html>`). ✘

## 8. Accessibility

Strengths: alt text on most images, `aria-live="polite"` on chat log, `<dialog>` element,
real `<button>` elements for switches, `tabindex` on the bug.

Gaps (each maps to an audit item in §11):
- Hamburger is an `<a>` with no `href`/`role`/`aria-expanded`; menu links partly hidden on mobile only.
- No skip-to-content link; heading hierarchy broken (no h1; h2→h4/h5 skips).
- Core content gated behind hover/click Easter eggs with no keyboard path or text alternative.
- Contrast: muted grays (`#9198a1`, `#acb3b9`) on dark panels hover around/below AA for body text.
- No focus-visible styling audit; heavy motion with no reduced-motion fallback; audio autoplays on interaction without a mute control.
- Impact font at small sizes is genuinely hard to read (condensed, tight letterforms).

## 9. Performance

Impressive for a hand-built site: typed-array particle system, OffscreenCanvas worker,
sprite preloading, `defer` scripts, some `loading="lazy"`, debounced resize, a service
worker, `font-display: swap`.

Costs: ~170KB raw HTML (inline SVG logos repeated **twice** in full), 3,249-line
render-blocking CSS, 136 images (many large PNGs with no `srcset`/WebP for most,
no width/height attrs → CLS risk), 6 third-party CDN origins (SPOF + privacy),
zero minification/compression pipeline, everything on one page = one giant initial load.

## 10. Third-party & external services inventory

GSAP + plugins (cdnjs/jsdelivr) · Lenis (unpkg) · Google Analytics 4 · Google Calendar
scheduling widget · cdnfonts.com · CloudFront font URL · Netlify (hosting, Functions,
Forms, Blobs, cron) · Supabase (pgvector) · OpenAI (embeddings + gpt-4o-mini) ·
GitHub GraphQL API · avatars.githubusercontent.com hotlinks.

## 11. Design audit — issues, impact, recommended fix

Legend: 🔴 high · 🟠 medium · 🟡 polish

### Identity & content
1. 🔴 **The entire visual identity is another person's likeness.** The hero portrait,
   desk scenes, sprite character, waving emblem, resume PDF, AI knowledge base, GitHub/SO
   stats, analytics IDs, calendar URL — all are Bryan Elliott's real identity and personal
   IP (repo is UNLICENSED, footer asserts "All rights reserved"). *Impact:* the site cannot
   be "re-skinned"; shipping it with swapped text would still misrepresent authorship and
   reuse personal artwork. *Fix:* full content + asset replacement strategy (see roadmap);
   new art direction or newly created character art for the new owner.

### Typography
2. 🔴 **Impact as the universal font.** A condensed poster face used for body copy harms
   readability and reads as unpolished. *Fix:* proper type system — a distinctive display
   face for hero/headlines + a highly readable text face (variable font, `next/font`),
   fluid scale (`clamp()`), 1.5–1.7 body line-height.
3. 🟠 Mixed `px`/`em`, no scale; long paragraphs exceed 90ch on wide screens. *Fix:*
   type tokens + `max-width: 65–75ch` prose measure.

### Color & contrast
4. 🟠 Borrowed GitHub tokens + hardcoded hexes; no semantic palette; several
   text/background pairs near or below WCAG AA. *Fix:* small semantic token set
   (bg / surface / text / muted / accent / success…), AA-verified, expressed as CSS
   variables to enable theming.
5. 🟡 Dark-only. *Fix:* light/dark via `prefers-color-scheme` + toggle (token system makes
   this nearly free).

### Layout, spacing, hierarchy
6. 🟠 No spacing scale — dozens of magic numbers (`margin-bottom: 35px`, `.v-spacer-25`,
   `.mt-5` meaning 5px). *Impact:* uneven vertical rhythm between sections; hard to
   maintain. *Fix:* 4/8-pt spacing tokens; consistent section padding component.
7. 🟠 No `<h1>`; heading levels skip (h2→h4, h3→h5). *Impact:* SEO + screen-reader outline
   broken. *Fix:* one h1 in hero; strict h2/h3 per section.
8. 🟡 The replica GitHub/StackOverflow profile cards clone third-party UI wholesale
   (including their class names like `.qxCTlb`, `.Label--secondary`). Clever, but visually
   inconsistent with the rest and maintenance-hostile. *Fix:* redesign as native "proof"
   cards in the site's own design language, keeping the live data.

### Navigation & IA
9. 🔴 **The nav doesn't navigate the site.** Only 3 external links (Blog, LinkedIn,
   GitHub); there is no way to jump to About/Projects/Contact, no active-section
   indication, no sticky header after the hero. *Impact:* on a page this long
   (~10 full viewports), users must scroll blind. *Fix:* sticky slim nav with in-page
   section links + scroll-spy; keep socials as icons; add command palette later.
10. 🟠 Hamburger `<a>` without href/aria; unclear what it opens on desktop. *Fix:* real
    `<button aria-expanded>` + accessible menu.
11. 🟠 Information architecture buries the strongest proof (Experience, AI chat, Contact)
    ~7–9 viewports deep, and there is **no Projects/case-study section at all** —
    the single most expected portfolio content type. *Fix:* restructure order
    (Hero → About → Experience → Projects → Proof/OSS → AI → Contact) and add a
    projects grid + detail pages.

### Motion & interaction
12. 🔴 No `prefers-reduced-motion` support while running heavy continuous animation
    (starfield, particles, scroll-scrubbed globe, normalized scroll). *Impact:*
    accessibility violation (WCAG 2.3.3), battery drain, motion sickness. *Fix:* honor the
    media query — static hero fallback, disable scrub/pin, keep opacity-only reveals.
13. 🟠 Easter-egg content (coffee challenge, bug hunt) is delightful but **hover/pointer
    dependent** — unreachable by keyboard and partially by touch; "Hover me" instruction
    image is a PNG of text. *Fix:* keyboard/touch parity + text equivalents; keep the fun.
14. 🟠 Scroll behavior is heavily hijacked (Lenis + normalizeScroll + multiple pinned
    scrub sections). On mid-range devices this stutters and fights native gestures.
    *Fix:* audit each trigger, prefer transform-only scrubs, drop normalizeScroll unless
    demonstrably needed, keep Lenis optional.
15. 🟡 Several near-identical GSAP reveal blocks repeated per section. *Fix:* one reveal
    utility (or CSS scroll-driven animations where sufficient) — DRY and consistent easing.

### Componentization & code quality
16. 🔴 Monoliths: 1,120-line HTML, 2,378-line JS closure, 3,249-line CSS. No components,
    no types, duplicated inline SVG logo paths (the WordPress logo SVG appears twice in
    full). *Impact:* every change is risky; content edits require surgery. *Fix:* the
    Next.js migration itself — typed content data layer + components.
17. 🟠 Dead/debug artifacts: commented-out tween blocks, `STALE_AFTER_MS = 1`,
    `console.log` in cron, typos ("Febuary 19, 2015", "PR's reviewied", "What set's
    Bryan apart"). *Fix:* cleanup pass during migration.

### SEO & meta
18. 🔴 No meta description, robots.txt, sitemap, canonical, or JSON-LD Person/WebSite
    schema; no h1. *Fix:* Next.js Metadata API + structured data + sitemap route.

### Forms & feedback
19. 🟠 Contact form: no client-side validation UX beyond `required`, no honeypot/spam
    control visible, success message is inline text only; button label "Open web form"
    inside a Google-classnamed button (`.qxCTlb`). *Fix:* native form component with
    validation states, honeypot, and clear success/error patterns (keep Netlify Forms or
    move to a server action + email provider).
20. 🟡 Chat UI: no loading skeleton for first token beyond "Thinking…", no error retry,
    input not disabled during stream (recently patched for double-submit). *Fix:* proper
    chat state machine + optimistic UI + abort controller.

## 12. What is genuinely excellent (preserve at all costs)

- The **personality**: interactive scenes, challenges, mini-game, the rotating-globe
  career timeline — this is a memorable, top-1% portfolio concept.
- The **custom engines** (atomizer, starfield, game) are well-optimized, dependency-free,
  and portable — they can be wrapped as React client components nearly as-is.
- The **RAG chatbot** is a real, well-architected feature (hybrid retrieval, SSE
  streaming, token budgeting) that doubles as a skills demo.
- Live GitHub contribution pipeline (cron → Blobs → SW cache) is a nice systems touch.
- Honest, voice-driven copywriting structure (worth imitating in structure, not in words).
