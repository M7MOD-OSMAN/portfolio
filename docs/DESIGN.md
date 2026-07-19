# Design System — mahmoud-othman portfolio

> Locked direction for Milestone 3+. Change only deliberately; every section
> built after this doc must follow it.

## Design read

Developer portfolio for recruiters and hiring managers. Premium engineering
language with real personality; a quiet nod to the original site's dark-space
atmosphere without its cartoon identity. Dials: **VARIANCE 7 / MOTION 6 /
DENSITY 4** (asymmetry welcome, motion purposeful, generous spacing).

## Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Bricolage Grotesque** (`--font-display`) | h1/h2, name mark. Bold, tracking-tight. |
| Body/UI | **Geist** (`--font-sans`) | Everything else. |
| Mono | **Geist Mono** (`--font-mono`) | Dates, meta, code accents. |

Body text: `leading-relaxed`, `max-w-[65ch]`. No Inter, no serifs, no
mixed-family emphasis (use weight/italic of the same family).

## Color

Semantic tokens only (defined in `src/app/globals.css`, mapped via `@theme`):

`background · surface · surface-2 · foreground · muted · edge · edge-strong ·
accent · accent-ink · accent-soft`

- Neutrals: zinc family. Light bg `#fafafa`; dark bg `#0b0b0e` (near-black
  with a hint of blue). **No pure black/white.**
- **Accent: burnt orange, locked site-wide.** Light: `#ea580c` (accent) /
  `#c2410c` (accent-ink, AA for text on light). Dark: `#fb923c` / `#fdba74`.
- Accent is a *signal* color: links, focus rings, selection, highlights.
  **Primary buttons are monochrome** (foreground-on-background inversion),
  never accent-filled.
- One accent for the whole site. No second hue, ever.

## Shape

Documented radius rule (applied everywhere, no exceptions):
- Buttons & pills → `rounded-full`
- Cards & surfaces → `rounded-(--radius-surface)` (1rem)
- Inputs → `--radius-control` (0.625rem)

## Theming

- `next-themes`, class strategy (`.dark` on `<html>`), default **system**,
  manual toggle in the header. `disableTransitionOnChange`.
- Both modes must be checked before any section ships. Hierarchy parity:
  what pops in light pops in dark.
- One theme per page; sections never invert mid-scroll.

## Motion

- Library: `motion/react`. GSAP only if a later milestone needs true
  pin/scrub scrolltelling (isolated leaf components).
- Primitive: `<Reveal>` (fade-up on viewport entry, `once`, ease
  `[0.16, 1, 0.3, 1]`).
- Every animation must be justifiable in one sentence (hierarchy /
  storytelling / feedback / state). No infinite loops by default.
- `prefers-reduced-motion`: global CSS kill-switch + `useReducedMotion()`
  in every animated component. Non-negotiable.

## Layout

- Container: `max-w-6xl`, `px-6 md:px-10`. Section rhythm: `py-24 md:py-32`
  (`<Section>` owns this; sections don't invent spacing).
- Nav: single line, ≤ 72px.
- Anti-template rules in force: no 3-equal-card feature rows, max 1 eyebrow
  per 3 sections, no zigzag more than 2 in a row, no em-dashes in copy,
  no decorative dots/scroll cues/section numbering.

## Components (src/components/ui)

- `Button` / `ButtonLink` — primary (mono), secondary (outline), ghost.
- `Section` / `SectionHeading` — layout shell + h2 style.
- `Reveal` — scroll reveal primitive.
- `ThemeToggle` — accessible, hydration-safe.

Icons: `@phosphor-icons/react` only, `weight="bold"`, one family site-wide.
