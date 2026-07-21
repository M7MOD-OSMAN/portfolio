/**
 * Shared motion tokens. Set-pieces import from here rather than inventing
 * their own timing, so GSAP-driven and `motion/react`-driven animation stay
 * on the same curve.
 *
 * The cubic-bezier matches the `<Reveal>` primitive and the `.animate-rise`
 * keyframe in globals.css. Changing it here does not change those — keep the
 * three in sync by hand.
 */

/** Bezier control points, for `motion/react` `transition.ease`. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** The same curve in GSAP's `CustomEase` string form. */
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  /** Hover states, toggles, and other direct feedback. */
  fast: 0.2,
  /** The default: entrances, reveals, section transitions. */
  base: 0.6,
  /** Deliberate, attention-carrying moves. Use sparingly. */
  slow: 1.2,
} as const;

/**
 * Height of the sticky header (`h-16`). Scroll targets offset by this so
 * anchored headings do not land underneath it.
 */
export const HEADER_OFFSET = 64;

/**
 * Lenis tuning. `lerp` is the frame-to-frame interpolation factor: lower is
 * heavier and more floaty. 0.12 stays responsive enough that the page does
 * not feel disconnected from the wheel.
 */
export const LENIS_OPTIONS = {
  lerp: 0.12,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
} as const;
