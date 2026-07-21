"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/components/motion/use-gsap";
import { cn } from "@/lib/cn";

/**
 * An oversized word drifting horizontally behind a section, scrubbed by scroll.
 *
 * Ported from the legacy site (`main.js:307`), which tweened a background word
 * by `-offsetWidth` between the section entering and leaving the viewport.
 * Cheap, and it gives a long section a sense of travel without competing with
 * the copy in front of it.
 *
 * Two departures from the original:
 *
 * - `xPercent` rather than a pixel offset measured at setup time. The legacy
 *   version captured `offsetWidth` once, so a resize or a late font swap left
 *   the word travelling the wrong distance.
 * - The tween is a `fromTo` centred on the element's natural position, so the
 *   static state — what reduced-motion users get, since `useGsap` skips setup
 *   entirely — is the midpoint of the travel rather than one extreme.
 */
export function ScrubWord({
  word,
  className,
  distance = 12,
}: {
  word: string;
  className?: string;
  /** Travel in each direction, as a percentage of the word's own width. */
  distance?: number;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ scope: element }) => {
      gsap.fromTo(
        element.querySelector("[data-scrub-word]"),
        { xPercent: distance },
        {
          xPercent: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
            invalidateOnRefresh: true,
          },
        },
      );
    },
    scope,
    [distance],
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none",
        className,
      )}
    >
      <span
        data-scrub-word
        className="font-display text-[24vw] leading-none font-bold tracking-tight whitespace-nowrap text-edge/60"
      >
        {word}
      </span>
    </div>
  );
}
