"use client";

import { motion, useReducedMotion } from "motion/react";

type Direction = "up" | "down" | "left" | "right";

/** Offset the content animates *from*, per direction. */
const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
};

/**
 * Scroll-reveal primitive: fades content in as it enters the viewport.
 *
 * Defaults to a fade-up (the site-wide house style). `direction` lets a
 * component pull the entrance in from a side instead — used sparingly, where
 * the movement reinforces layout: a side rail sliding in from its own edge,
 * for instance.
 *
 * Reduced motion is handled through `transition`, deliberately, not through
 * `initial`. `useReducedMotion()` returns `false` during SSR and `true` on the
 * client, so branching the *rendered* `initial` on it made the server emit
 * `opacity: 0` while the client emitted nothing — a hydration mismatch on
 * every Reveal on the page. `initial` is now identical on both sides; only the
 * transition duration reacts to the preference, and transition is consumed by
 * motion's effects rather than serialised into the markup, so it cannot
 * mismatch. Under reduced motion the content still resolves to visible, just
 * instantly and with no travel.
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
