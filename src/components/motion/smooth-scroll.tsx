"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { HEADER_OFFSET, LENIS_OPTIONS } from "@/lib/motion";

/**
 * Smooth scrolling, driven by Lenis and synchronised with GSAP's ScrollTrigger.
 *
 * Renders nothing. Mounted inside the `(site)` route group only, which keeps
 * it off `/studio` — Sanity Studio has its own scroll containers and breaks
 * badly under a hijacked page scroll.
 *
 * Under `prefers-reduced-motion` no Lenis instance is created at all, so the
 * browser's native scrolling is left completely untouched. This is the whole
 * reason the provider is hand-rolled rather than using `lenis/react`.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Returned by `start()` so a preference change can tear down cleanly.
    let stop: (() => void) | null = null;

    const start = () => {
      const lenis = new Lenis({
        ...LENIS_OPTIONS,
        // GSAP's ticker drives the loop instead, so that scroll position and
        // ScrollTrigger's calculations resolve within the same frame. Two
        // independent rAF loops produce a one-frame lag that reads as jitter
        // on pinned sections.
        autoRaf: false,
      });

      const raf = (time: number) => {
        // GSAP reports seconds; Lenis expects milliseconds.
        lenis.raf(time * 1000);
      };

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);

      // Default lag smoothing would freeze the scroll loop after a long
      // frame (a heavy Sanity image decode, a slow paint), leaving Lenis and
      // the real scroll position out of sync.
      gsap.ticker.lagSmoothing(0);

      // Native anchor jumps bypass Lenis entirely, so in-page nav would snap
      // while everything else glides. Route those through `scrollTo`, offset
      // by the sticky header.
      const onClick = (event: MouseEvent) => {
        // Let modified clicks (new tab, download, context menu) behave natively.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const anchor = (event.target as HTMLElement | null)?.closest("a");
        const href = anchor?.getAttribute("href");
        if (!href?.startsWith("#") || href === "#") return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        event.preventDefault();
        lenis.scrollTo(target, { offset: -HEADER_OFFSET });

        // `scrollTo` moves the viewport but does not move focus, which would
        // strand keyboard and screen reader users at the top of the page.
        // `preventScroll` stops the browser from undoing the smooth scroll.
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });

        // Keep the URL and history behaviour of a real anchor.
        window.history.pushState(null, "", href);
      };

      document.addEventListener("click", onClick);

      stop = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 20);
        lenis.destroy();
      };
    };

    if (!query.matches) start();

    // Respond to the preference flipping mid-session.
    const onPreferenceChange = () => {
      stop?.();
      stop = null;
      if (!query.matches) start();
    };

    query.addEventListener("change", onPreferenceChange);

    return () => {
      query.removeEventListener("change", onPreferenceChange);
      stop?.();
    };
  }, []);

  return null;
}
