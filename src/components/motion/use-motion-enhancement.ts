"use client";

import { useEffect, useState } from "react";

/**
 * Whether a heavyweight scroll set-piece (pin + scrub) may replace its static
 * baseline on this device.
 *
 * Three gates, all of which have to pass:
 *
 * - **No `prefers-reduced-motion`.** A scroll-hijacking pin is exactly the
 *   thing that preference exists to switch off.
 * - **Wide enough.** Pinned scrollytelling needs room for the art *and* the
 *   content beside it; below `md` one of the two always loses.
 * - **`pointer: fine`.** Pinning on touch means fighting momentum scrolling,
 *   dynamic browser chrome that resizes the viewport mid-pin, and iOS Safari's
 *   `position: fixed` quirks. `anticipatePin` mitigates the first and nothing
 *   really fixes the rest, so touch gets the baseline instead. This is the
 *   "skip pinning entirely on touch" branch, chosen deliberately.
 *
 * Always returns `false` on the first render so the server and client agree;
 * the enhancement swaps in after mount.
 */
export function useMotionEnhancement(minWidth = 768) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia(`(min-width: ${minWidth}px)`),
      window.matchMedia("(pointer: fine)"),
    ] as const;

    const sync = () => {
      const [reduce, wide, fine] = queries;
      setEnabled(!reduce.matches && wide.matches && fine.matches);
    };

    sync();
    for (const query of queries) query.addEventListener("change", sync);
    return () => {
      for (const query of queries) query.removeEventListener("change", sync);
    };
  }, [minWidth]);

  return enabled;
}
