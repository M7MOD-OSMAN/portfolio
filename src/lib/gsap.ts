"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 *
 * `registerPlugin` is idempotent, but funnelling every import through this
 * module means plugin registration cannot be forgotten in a leaf component,
 * and there is one place to add future plugins (CustomEase, MotionPath).
 *
 * Guarded because this module is imported by client components that Next
 * still evaluates on the server during SSR, where `window` is absent.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
