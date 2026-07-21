"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * `useLayoutEffect` warns when React renders on the server. Animation setup
 * has to run before paint on the client, so swap the implementation rather
 * than downgrade to `useEffect` everywhere.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type GsapSetup = (context: {
  /** The scope element, non-null by the time setup runs. */
  scope: HTMLElement;
}) => void;

/**
 * Runs GSAP setup inside a `gsap.context()` scoped to `ref`, reverting every
 * tween, timeline and ScrollTrigger it created on cleanup.
 *
 * The revert matters more than it looks: React 19 in development mounts,
 * unmounts and remounts effects. Without a context, each cycle leaves its
 * ScrollTriggers registered, and they accumulate — pinned sections end up
 * with several triggers fighting over the same element and the pin spacing
 * doubles on every hot reload.
 *
 * Setup is skipped entirely under `prefers-reduced-motion`, so every consumer
 * must render a usable static state on its own. Animation is the enhancement,
 * never the thing that makes content legible.
 */
export function useGsap(
  setup: GsapSetup,
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  // Lets callers pass an inline closure without the animation tearing down
  // and rebuilding on every render. `useEffectEvent` would be the idiomatic
  // choice, but its values may not be passed into another function — and
  // `gsap.context()` takes the setup as a callback — so a ref it is, synced
  // in its own effect rather than during render.
  const setupRef = useRef(setup);

  useIsomorphicLayoutEffect(() => {
    setupRef.current = setup;
  });

  useIsomorphicLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      setupRef.current({ scope: element });
    }, element);

    return () => context.revert();
  }, [scope, ...deps]);
}
