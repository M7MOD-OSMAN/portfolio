"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/components/motion/use-gsap";
import { HEADER_OFFSET } from "@/lib/motion";
import { formatRange } from "@/lib/date";
import type { Role } from "@/content/types";

/*
 * ---------------------------------------------------------------------------
 * Geometry
 * ---------------------------------------------------------------------------
 *
 * The world is one very large circle whose centre sits far below the viewBox,
 * so only the top of its arc is ever on screen. Every monolith is authored
 * standing on the apex and then rotated into place, which means "bring role i
 * to the front" is a single rotation of -i * STEP_DEG on the parent group.
 *
 * This is the legacy site's mechanic (`main.js:1424` — pin, scrub, rotate)
 * with its isometric buildings and walk-cycle spritesheet replaced by flat
 * geometry, per the art direction locked in docs/MOTION_PLAN.md.
 */

const VIEW_W = 760;
const VIEW_H = 720;

/** Circle centre, well below the viewBox. */
const CX = 380;
const CY = 1150;
const R = 760;

/** Apex of the arc — the "front", where the active role stands. */
const APEX_Y = CY - R;

/** Angular gap between consecutive roles. */
const STEP_DEG = 26;

const MONOLITH_W = 46;
const MONOLITH_MIN_H = 120;
const MONOLITH_MAX_H = 300;

/** Scroll distance, in pixels, spent travelling between two roles. */
const SCROLL_PER_ROLE = 640;

/** Months between two "YYYY-MM" stamps. */
function monthsBetween(start: string, end: string) {
  const [ys, ms] = start.split("-").map(Number);
  const [ye, me] = end.split("-").map(Number);
  return Math.max(1, (ye - ys) * 12 + (me - ms));
}

/**
 * A monolith's height encodes how long the role lasted.
 *
 * Ongoing roles deliberately do not get a measured height: the page is
 * statically generated, so anything derived from "now" would drift between
 * deploys (the same reasoning as `formatRange` in lib/date.ts). They render at
 * full height with an open, dashed cap instead, which reads as "still
 * building" and stays correct forever.
 */
function monolithHeight(role: Role) {
  if (role.end === null) return MONOLITH_MAX_H;
  const months = monthsBetween(role.start, role.end);
  return Math.min(MONOLITH_MAX_H, MONOLITH_MIN_H + months * 5);
}

export function ExperienceOrbit({ roles }: { roles: Role[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const last = roles.length - 1;

  useGsap(
    ({ scope }) => {
      const world = scope.querySelector("[data-world]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-role-card]", scope);
      const lights = gsap.utils.toArray<SVGElement>("[data-monolith-light]", scope);
      const progress = scope.querySelector("[data-progress]");

      if (!world || cards.length === 0) return;

      gsap.set(cards.slice(1), { autoAlpha: 0, y: 28 });
      gsap.set(lights.slice(1), { autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: `top ${HEADER_OFFSET}px`,
          end: `+=${last * SCROLL_PER_ROLE}`,
          pin: true,
          scrub: 1,
          // The pin is applied a frame early. Without it, a fast scroll can
          // land past the trigger before the pin engages and the section
          // visibly jumps (`main.js:1431` hit the same thing).
          anticipatePin: 1,
          // Viewport resizes (and the font swap) change the pin's start, so
          // recompute rather than scrub against a stale measurement.
          invalidateOnRefresh: true,
        },
      });

      // One unit of timeline time per role, so a position of `i` is exactly
      // the moment role `i` is centred on the apex.
      //
      // `svgOrigin` has to ride along in the tween's own vars. Setting it in a
      // preceding `gsap.set()` does not stick — the rotation tween rebuilds
      // the transform from the element's bounding-box centre and the whole
      // world swings out of frame instead of turning under the marker.
      timeline.to(
        world,
        {
          rotation: -last * STEP_DEG,
          svgOrigin: `${CX} ${CY}`,
          duration: last,
        },
        0,
      );

      roles.forEach((_, index) => {
        const card = cards[index];
        const light = lights[index];

        if (index > 0) {
          timeline.to(card, { autoAlpha: 1, y: 0, duration: 0.4 }, index - 0.45);
          if (light) timeline.to(light, { autoAlpha: 1, duration: 0.4 }, index - 0.45);
        }

        if (index < last) {
          timeline.to(card, { autoAlpha: 0, y: -28, duration: 0.4 }, index + 0.05);
          if (light) timeline.to(light, { autoAlpha: 0, duration: 0.4 }, index + 0.05);
        }
      });

      if (progress) {
        timeline.fromTo(
          progress,
          { scaleX: 1 / roles.length },
          { scaleX: 1, duration: last },
          0,
        );
      }
    },
    stage,
    [roles.length],
  );

  return (
    <div
      ref={stage}
      data-orbit-stage
      className="relative mt-12 grid items-center gap-8 overflow-hidden rounded-(--radius-surface) border border-edge bg-surface p-8 md:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] md:p-10"
      style={{ height: `calc(100vh - ${HEADER_OFFSET}px)` }}
    >
      {/*
       * Every card stays in the accessibility tree. They are stacked and
       * cross-faded with opacity rather than `display`/`visibility`, so a
       * screen reader still reads all four roles in order while a sighted
       * reader scrubs through them one at a time. `pointer-events-none` keeps
       * the inactive ones from swallowing clicks. Nothing inside is focusable,
       * so there is no hidden-focus trap to worry about.
       */}
      <ol className="pointer-events-none grid">
        {roles.map((role, index) => (
          <li
            key={role.id ?? `${role.company}-${role.start}`}
            data-role-card
            className="col-start-1 row-start-1"
          >
            <RoleCard role={role} index={index} total={roles.length} />
          </li>
        ))}
      </ol>

      <div className="relative h-full">
        <World roles={roles} />
      </div>

      {/*
       * Progress rail. A pinned section stops the page from moving, so
       * without a read on how much travel is left the scroll feels broken.
       * This is feedback, not the decorative scroll cue DESIGN.md rules out.
       */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-edge-strong/40"
      >
        <div
          data-progress
          className="h-px origin-left bg-accent"
          style={{ transform: `scaleX(${1 / roles.length})` }}
        />
      </div>
    </div>
  );
}

function RoleCard({
  role,
  index,
  total,
}: {
  role: Role;
  index: number;
  total: number;
}) {
  return (
    <div className="rounded-(--radius-surface) border border-edge bg-background p-6 md:p-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent-ink">
          {String(index + 1).padStart(2, "0")}
          <span className="text-muted"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span className="font-mono text-sm text-muted">
          {formatRange(role.start, role.end)}
        </span>
      </div>

      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
        {role.title}
      </h3>
      <p className="mt-1 text-muted">
        {role.company}
        <span className="text-edge-strong"> / </span>
        {role.location}
        {role.sideEngagement ? (
          <span className="text-edge-strong"> / concurrent engagement</span>
        ) : null}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {role.highlights.map((highlight) => (
          <li
            key={highlight}
            className="max-w-[68ch] text-sm leading-relaxed text-muted"
          >
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {role.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-edge bg-surface px-3 py-1 font-mono text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The geometric world. Purely decorative — the role content lives in the
 * cards above it, so this is hidden from assistive technology entirely.
 */
function World({ roles }: { roles: Role[] }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 size-full"
    >
      <defs>
        <radialGradient id="orbit-glow">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g data-world style={{ willChange: "transform" }}>
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--edge-strong)"
          strokeWidth="1.5"
        />

        {roles.map((role, index) => (
          <g
            key={role.id ?? `${role.company}-${role.start}`}
            transform={`rotate(${index * STEP_DEG} ${CX} ${CY})`}
          >
            <Monolith role={role} />
          </g>
        ))}
      </g>

      {/*
       * The marker stays outside the rotating group: it holds the apex while
       * the world turns underneath it. That inversion is what replaces the
       * legacy walk cycle (`main.js:1448`) — the travelling is the rotation,
       * so no sprite is needed.
       */}
      <g>
        <circle cx={CX} cy={APEX_Y} r={105} fill="url(#orbit-glow)" />
        <circle
          cx={CX}
          cy={APEX_Y}
          r="7"
          fill="var(--accent)"
          stroke="var(--background)"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

/** One role, authored standing on the apex; the parent group rotates it away. */
function Monolith({ role }: { role: Role }) {
  const height = monolithHeight(role);
  const x = CX - MONOLITH_W / 2;
  const top = APEX_Y - height;
  const ongoing = role.end === null;

  return (
    <>
      <rect
        x={x}
        y={top}
        width={MONOLITH_W}
        height={height}
        fill="var(--surface-2)"
        stroke="var(--edge-strong)"
        strokeWidth="1.5"
      />

      {/* Windows: a fixed rhythm, not one per anything — they are texture. */}
      {Array.from({ length: Math.floor(height / 34) }, (_, row) => (
        <rect
          key={row}
          x={x + 12}
          y={top + 16 + row * 34}
          width={MONOLITH_W - 24}
          height="10"
          fill="var(--edge-strong)"
        />
      ))}

      {/*
       * Lit only while this role is the active one, and drawn *over* the body
       * as a translucent accent wash rather than under it as a coloured halo.
       *
       * The first attempt filled a slightly larger rect behind with
       * `--accent-soft`. That token is a pale peach in light mode and a dark
       * brown in dark mode, so the lit state was obvious on dark and nearly
       * invisible on near-white. `--accent` is mid-tone in both themes, so a
       * low-opacity wash of it reads the same either way — and the windows
       * still show through.
       */}
      <rect
        data-monolith-light
        x={x - 2}
        y={top - 2}
        width={MONOLITH_W + 4}
        height={height + 2}
        fill="var(--accent)"
        fillOpacity="0.18"
        stroke="var(--accent)"
        strokeWidth="2"
      />

      {ongoing ? (
        <line
          x1={x}
          y1={top}
          x2={x + MONOLITH_W}
          y2={top}
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
      ) : null}
    </>
  );
}
