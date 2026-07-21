# Motion & Set-Piece Plan

> Milestone plan for bringing legacy-grade motion (`legacy/`, elliottprogrammer.com)
> into this site, reinterpreted to fit `DESIGN.md`. Read `DESIGN.md` first —
> it constrains everything below.

## Decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| Art direction | **Abstract / geometric**, not character illustration | Legacy art is Bryan Elliott's likeness + his employers' buildings. Not reusable, and `DESIGN.md` explicitly rejects "cartoon identity". |
| Motion stack | **GSAP + ScrollTrigger + Lenis**, added alongside `motion/react` | Pin + scrub has no Framer Motion equivalent. `DESIGN.md:57` already sanctions GSAP for "isolated leaf components". |
| Scope | Two set-pieces + site-wide motion pass | Avoids two flashy sections bolted onto a plain site. |

**Constraints that override "make it cool":**
- One accent (burnt orange). No second hue. The legacy's blue/green world palette does **not** come along.
- `prefers-reduced-motion` is non-negotiable — every item below ships a static fallback in the same PR, not a follow-up.
- GSAP stays in client leaf components. Sections remain server components fed by Sanity.

---

## What we're actually porting

The legacy value is **mechanics**, not assets:

| Legacy mechanic | Source | Reinterpretation |
|---|---|---|
| Pinned section, scroll drives rotation | `main.js:1424` (`pin: true, scrub: true, end: '+=2000'`) | Same, verbatim technique |
| Character walks via 14-frame spritesheet | `main.js:1448` (`steps(13)` on `backgroundPosition`) | Replaced — a traveling marker on an arc, no sprite |
| Isometric buildings, front/back layers around a globe | `index.html:750-860` | Geometric monoliths, CSS/SVG, accent-lit |
| Hidden-object puzzle w/ light switch reveal | `index.html:120-190`, `main.js:771-830` | Same interaction beat, abstract scene |
| Scroll-scrubbed background word | `main.js:307` | Port directly, cheap and effective |

---

## Milestone A — Motion foundation ✅

Nothing visual ships here. This is the substrate; doing it first prevents
three different scroll implementations fighting each other.

- [x] Add `gsap` (3.15.0) + `lenis` (1.3.25).
- [x] `src/lib/gsap.ts` — single `registerPlugin` point, SSR-guarded.
- [x] `src/components/motion/smooth-scroll.tsx` — Lenis wired to
      `ScrollTrigger.update` and `gsap.ticker` (mirrors `main.js:41-51`).
      No instance is constructed at all under reduced motion.
- [x] `src/lib/motion.ts` — shared eases, durations, Lenis tuning.
- [x] `useGsap` hook wrapping `gsap.context()` for React 19 cleanup.
- [x] Mounted in `(site)/layout.tsx`, so `/studio` is excluded structurally
      rather than by a path check.
- [x] Anchor nav routed through `lenis.scrollTo` with header offset, plus
      focus move and `history.pushState` to preserve real anchor behaviour.
- [x] `npm run build`, `tsc --noEmit`, `eslint src/` all clean.

**Resolved during implementation:**
- Lenis 1.3 no longer ships the `scroll-behavior: auto !important` override
  older versions had, so `globals.css` guards it manually with
  `html:not(.lenis)`. Without this, Lenis and CSS smooth scroll fight.
- `gsap.ticker.lagSmoothing(0)` rather than the legacy's `(500, 20)` — lag
  smoothing freezes the scroll loop after a long frame and desyncs Lenis
  from the real scroll position.
- `useEffectEvent` (React 19.2) was the intended way to keep `setup` out of
  the dep list, but its values may not be passed to another function, and
  `gsap.context()` takes a callback. Uses a ref synced in its own effect.

**Still unverified — needs a real browser:**
- Scroll feel and `lerp` tuning.
- Anchor nav and scroll-spy interaction under Lenis.
- Mobile Safari.

## Milestone B — Experience set-piece ✅

Replaces the current timeline in `src/components/sections/experience.tsx`.

- [x] Geometric world in `experience-orbit.tsx`: one circle (centre far below
      the viewBox), one monolith per role. Each monolith is authored standing
      on the apex and rotated into place by `index * 26°`, so "bring role i to
      the front" is a single `rotation: -i * 26` on the parent group.
      Data-driven: height encodes role duration, still fed by `getRoles()`.
- [x] Pinned ScrollTrigger, `scrub: 1`, `640px` of scroll per role.
- [x] Traveling marker — a lit node held at the apex *outside* the rotating
      group. The world turns underneath it, which is what replaces the legacy
      walk cycle; no sprite, no `steps()`.
- [x] Role cards reuse the timeline's markup verbatim (title, company,
      location, dates, highlights, tech pills), so content parity is exact.
- [x] **Fallback:** `useMotionEnhancement()` gates the swap. The server always
      renders `ExperienceTimeline`; `ExperienceStage` replaces it after mount
      only when all three of no-reduced-motion, `≥ md`, `pointer: fine` hold.
- [x] Mobile: took the "skip pinning entirely on touch" branch via
      `pointer: fine`. `anticipatePin: 1` is still set for fast desktop
      scrolls.
- [x] `npm run build`, `tsc --noEmit`, `eslint src/` all clean.

**Decisions made during implementation:**
- The stage is a bordered, rounded box inside the existing `max-w-6xl`
  container rather than a full-bleed `w-screen` breakout. `w-screen` plus a
  vertical scrollbar causes horizontal overflow, and the contained frame reads
  as a deliberate window into the world.
- Cards cross-fade with `autoAlpha` + `pointer-events-none` while all four
  stay in the DOM and in the accessibility tree, so a screen reader reads every
  role in order. Nothing inside a card is focusable, so there is no
  hidden-focus trap. No content is duplicated between the two renderings.
- Ongoing roles get a full-height monolith with a dashed open cap instead of a
  measured one. A height derived from "now" would drift between deploys —
  the same reason `lib/date.ts` refuses to print durations.
- `svgOrigin` rather than `transformOrigin`: GSAP otherwise pivots an SVG group
  around its own bounding box, not the circle's centre.
- Pin starts at `top ${HEADER_OFFSET}px` and the stage is
  `calc(100vh - 4rem)`, so the sticky header never covers the set-piece.

**Found and fixed by driving it in a real browser** (headless Chrome against
the dev server; the state was read back by solving the world group's transform
matrix for its rotation centre, not by eyeballing pixels):

- `svgOrigin` set in a preceding `gsap.set()` **does not stick**. The rotation
  tween rebuilt the transform from the group's bounding-box centre — solving
  the matrix showed it pivoting about (940, 866) instead of (500, 1180), which
  swung the whole arc out of frame by the third role. It has to ride in the
  tween's own vars.
- The card was laid over the apex, so the active monolith rendered *behind* it.
  Split into a two-column grid: card left, world right, no overlap.
- Theme parity, exactly where it was predicted: the lit monolith used
  `--accent-soft` (pale peach on light, dark brown on dark) and was invisible
  in light mode. Now a low-opacity `--accent` wash drawn over the body, which
  is mid-tone in both themes.

**Verified:** one monolith lit per step in order, rotation landing on exactly
-26° / -52° / -78°; no console errors; the tallest card (V4Tech, 5 highlights)
clears the clipping stage at 1440x720; reduced motion and narrow viewports both
fall through to the timeline.

**Harness note:** `scrub: 1` trails the scroll by a full second. An early pass
screenshotted 700ms after scrolling and captured mid-flight frames that looked
exactly like geometry bugs. Any future driver needs ~2s of settle time.

**Still open (taste, not correctness):** whether 640px of scroll per role is
the right pace, and whether the stage's vertical dead space above and below the
arc wants tightening. Both want a human on a real trackpad.

## Milestone C — About Me + the puzzle ✅

- [x] Copy supplied by Mahmoud. Cleaned of PDF line-break artifacts and split
      into three paragraphs. Bundled at `src/content/about.ts`.
- [x] `about` Sanity schema (singleton, fixed `_id`), `aboutQuery`, and
      `getAbout()` falling through to the bundled copy like every other loader.
      Seeded by `scripts/seed-sanity.ts`.
- [x] Section shell + scroll-scrubbed background word, ported from
      `main.js:307` as a reusable `<ScrubWord>` — Milestone D needs the same
      thing on Projects and Skills. Two changes from the legacy: `xPercent`
      instead of a pixel offset captured once at setup (which went wrong on
      resize or a late font swap), and a `fromTo` centred on the natural
      position so the reduced-motion static state is the midpoint of travel
      rather than one extreme.
- [x] The puzzle: **signal grid**. Powering it sets all 45 nodes breathing on
      a 1.8s cycle except three at 2.9s, which drift out of phase. Same three
      legacy beats (dark → lit → found), zero character art.
- [x] `legacy/confettea.js` ported to `src/lib/confetti.ts`. Physics kept
      verbatim; palette cut from six saturated hues to accent-plus-neutrals
      read from live CSS custom properties, so it follows the theme.
- [x] **A11y:** roving-tabindex grid, real `<button>`s, arrows/Home/End/Enter,
      `aria-live` on every state change. Verified by solving the puzzle
      end-to-end with the keyboard only, in a browser.
- [x] Reduced motion: targets carry a static colour difference, so the puzzle
      is solvable with every animation flattened. Verified.

**Bugs found by driving it, not by reading it:**
- **Focus was destroyed on first lock.** Found nodes had a real `disabled`
  attribute, which drops focus to `<body>` — a keyboard player was ejected
  from the grid the instant they got one right, with arrow keys dead and no
  way back in short of re-Tabbing. Now `aria-disabled`, with the handlers
  no-opping. This is precisely the failure the milestone existed to prevent
  and it passed typecheck, lint and build without a murmur.
- **The legacy confetti leaks.** It stops its rAF loop at `ticks` but only
  removes particles that have fallen past the viewport, so anything still on
  screen stays in the DOM forever at opacity ~0. The port tears the layer down
  on every exit path; verified 0 leftover nodes after a burst completes.

**Deliberate a11y trade-off:** the three targets announce themselves as "out of
phase" in their accessible name. That hands a screen-reader user what a sighted
user hunts for, on purpose. The goal is parity of *outcome* — both can finish —
not identical mechanics. A puzzle only some people can complete is a bug.

**Note:** `phase-breathe` is an infinite loop, which `DESIGN.md:62` bans "by
default". Justification: the phase difference between the two cycle lengths is
the puzzle's game state, not decoration. Remove the loop and there is nothing
to find.

## Milestone D — Site-wide motion pass ✅

Makes the whole site feel of a piece rather than two set-pieces plus filler.

- [x] Hero stagger. **Already satisfied by commit `967828b`.** The hero entrance
      is `<Rise>`, a CSS-only, server-rendered stagger (delays 0 / .08 / .16 /
      .24) that paints without waiting for hydration — which is exactly the
      constraint this bullet names. Re-implementing it in `motion/react` would
      *reintroduce* the LCP regression `967828b` fixed, so it was left alone.
- [x] Scroll-scrubbed background words on Projects (`SHIPPED`) and Skills
      (`STACK`), via the `<ScrubWord>` built in Milestone C. About already had
      one. Hardcoded per-section rather than CMS-editable — they are texture,
      not content (the About word is editable because it echoes the copy).
- [x] `Reveal` gained a `direction` variant (`up` default / `down` / `left` /
      `right`). Used on the Skills side rail (`direction="left"`), so the rail
      enters from the edge it lives on. Not sprayed everywhere — the ScrubWord
      layers already carry the section-entry parallax.
- [x] Project cards: hover lift + accent edge. The transform is on an inner
      element, not the `<Reveal>` — motion/react writes an inline `transform`
      when the reveal settles, and an inline transform beats a Tailwind
      `hover:` transform, so a lift on the reveal itself would silently no-op.
- [x] `npm run build`, `tsc`, `eslint` clean; verified in-browser both themes,
      plus a reduced-motion pass (scrub words present but static, no errors).

**Animation audit — one sentence each, per `DESIGN.md:61`:**

| Animation | Justification | Kind |
|---|---|---|
| Hero `Rise` stagger | Walks the eye down the hero in reading order | hierarchy |
| `Reveal` fade-up | Content announces itself as it enters the viewport | hierarchy |
| Skills rail `Reveal` left | Rail enters from the edge it occupies | hierarchy |
| `ScrubWord` drift | Gives long sections travel without competing with copy | storytelling |
| Experience orbit pin/scrub | Scroll drives the career timeline itself | storytelling |
| Card hover lift + accent edge | Signals the card is interactive | feedback |
| Thumbnail hover scale | Same, reinforces the card as a live link | feedback |
| Signal-grid breathe | The phase difference *is* the puzzle | state |
| Confetti burst | Celebrates the solve | feedback |

Nothing failed the one-sentence test, so nothing was cut.

## Milestone E — Verification ✅

- [x] **Reveal hydration mismatch — fixed.** `useReducedMotion()` is false in
      SSR and true on the client, so branching the rendered `initial` on it
      made the server emit `opacity: 0` while the client emitted nothing — a
      mismatch on every Reveal. Fix: `initial` is now identical on both sides
      (`{opacity:0, ...offset}`); only `transition` reacts to the preference
      (`duration: 0` under reduced motion), and transition is consumed by
      motion's effects, not serialised to markup, so it cannot mismatch.
      Verified: reduced-motion load is console-clean, no hydration warnings.
- [x] **Reduced-motion pass.** Every section resolves to visible (opacity 1)
      when scrolled naturally; the orbit and puzzle both fall to their static
      states. (An early probe reported some headings at opacity 0 — that was
      `scrollIntoViewIfNeeded` jumping *past* a `whileInView` trigger, not
      stranded content. Natural scroll and screenshots confirm all visible.)
- [x] **Keyboard + SR.** Tab order from the top is skip-link → logo → nav in
      order. The puzzle was solved end-to-end by keyboard alone in Milestone C
      (arrows/Enter, focus tracked through every lock, `aria-live` announcing).
- [x] **Bundle / LCP.** Measured against the production build (not dev):
      **LCP 420 ms** — no regression; the hero still paints before hydration
      (commit `967828b` holds). GSAP + Lenis load as deferred client chunks,
      non-render-blocking. Next 16 Turbopack no longer prints a First-Load-JS
      column, so this was measured via the browser, not the build table.
- [x] **Both themes, all breakpoints.** No horizontal overflow at 375 / 390 /
      768 / 1024 / 1440 (`scrollW == clientW` at every width). Light/dark parity
      checked per section during B–D.
- [x] **Mobile Safari — verified with Playwright's WebKit engine.** Mobile
      (390px, touch): orbit correctly absent, timeline fallback renders, no
      overflow, clean. Desktop WebKit: the pin engages (`position: fixed`
      during pin), Lenis runs, and the world rotates on scrub — confirmed at
      role 3 (`-54°`, lit card 3, monolith at the apex).

**Verification gotcha worth recording.** Under WebKit, GSAP writes an SVG
group's rotation to the `transform` *attribute*, and WebKit's
`getComputedStyle(g).transform` returns `"none"` for that (Chrome surfaces it
as a matrix). A probe reading computed style therefore reads a *stationary*
world while it is visibly rotating. Read `g.getAttribute("transform")` instead.
Also: on a Lenis page, raw `window.scrollTo` is fought back to Lenis's virtual
position on the next tick and does not drive a scrub — drive with wheel/touch
or `lenis.scrollTo`.

**Still needs a human (tooling can't stand in):**
- Scroll *feel* — lerp weight, and whether 640px/role is the right pace. A
  headless engine proves it functions; it can't tell you it feels good.
- A real screen reader (VoiceOver/NVDA) end-to-end. The ARIA wiring and live
  regions are in place and were logic-tested, but nothing here replaces
  actually listening to it.
- Real iOS Safari hardware, for dynamic-toolbar viewport resizing during the
  pin. The orbit is gated off touch precisely to dodge this, so the exposure
  is low, but "low" is not "confirmed".

---

## Sequencing note

A blocks B and C. C is blocked on About Me copy existing. D can run in
parallel with C. Recommend A → B → (C ‖ D) → E.

## Status — all milestones complete

A ✅ B ✅ C ✅ D ✅ E ✅. Everything that can be verified headlessly has been.
The three items above under "still needs a human" are the only open threads,
and none is a code change — they are judgement calls (feel) and hardware
checks (a real screen reader, real iOS Safari) that no tool in this
environment can stand in for.
