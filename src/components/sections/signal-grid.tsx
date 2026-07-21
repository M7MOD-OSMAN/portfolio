"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LightbulbIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";

/*
 * The hidden-object puzzle, abstracted.
 *
 * Legacy beats, kept: dark scene -> a switch lights it -> something only
 * findable once lit -> a completion celebration (`index.html:120-190`,
 * `main.js:771-830`). Legacy art, dropped entirely.
 *
 * Here the scene is a grid of signal nodes. Powering it sets every node
 * breathing on the same 1.8s cycle except three, which run at 2.9s and drift
 * out of phase with the field. Find those three.
 *
 * Two things the legacy puzzle got wrong and this one does not:
 *
 * 1. It was mouse-only. Every node here is a real <button> in a roving-tabindex
 *    grid, driven by arrow keys, Home/End, Enter and Space.
 *
 * 2. It was purely visual, so it was unsolvable with a screen reader. The
 *    targets announce themselves as "out of phase" in their accessible name
 *    once the grid is powered. That deliberately gives away visually what a
 *    sighted player hunts for, because the goal is parity of *outcome* — both
 *    players can finish — not identical mechanics. A puzzle only some people
 *    can complete is a bug.
 */

const COLS = 9;
const ROWS = 5;
const TOTAL = COLS * ROWS;
const TARGET_COUNT = 3;

type Phase = "dark" | "lit" | "solved";

/** Three distinct indices, avoiding the outermost ring so none hide in a corner. */
function pickTargets() {
  const candidates: number[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    if (row > 0 && row < ROWS - 1 && col > 0 && col < COLS - 1) candidates.push(i);
  }

  const chosen = new Set<number>();
  while (chosen.size < TARGET_COUNT) {
    chosen.add(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return [...chosen];
}

export function SignalGrid() {
  const [phase, setPhase] = useState<Phase>("dark");
  const [targets, setTargets] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [message, setMessage] = useState("");

  const gridRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cancelBurst = useRef<(() => void) | null>(null);

  // A burst in flight must not outlive the component that fired it.
  useEffect(() => () => cancelBurst.current?.(), []);

  const power = () => {
    // Targets are chosen here rather than at render, which keeps the random
    // draw off the server entirely — no hydration mismatch to work around.
    setTargets(pickTargets());
    setFound([]);
    setPhase("lit");
    setMessage(
      `Grid powered. ${TARGET_COUNT} of ${TOTAL} nodes are out of phase. Find them.`,
    );
  };

  const reset = () => {
    cancelBurst.current?.();
    setPhase("dark");
    setTargets([]);
    setFound([]);
    setWrong(null);
    setMessage("Grid powered down.");
  };

  const select = (index: number) => {
    if (phase !== "lit" || found.includes(index)) return;

    if (!targets.includes(index)) {
      setWrong(index);
      setMessage("In phase. Keep looking.");
      window.setTimeout(() => setWrong(null), 500);
      return;
    }

    const next = [...found, index];
    setFound(next);

    if (next.length === TARGET_COUNT) {
      setPhase("solved");
      setMessage(`All ${TARGET_COUNT} locked. Grid synchronised.`);
      if (gridRef.current) cancelBurst.current = burstConfetti(gridRef.current);
    } else {
      setMessage(`Locked. ${next.length} of ${TARGET_COUNT}.`);
    }
  };

  const onKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;

    const moves: Record<string, number> = {
      ArrowRight: col < COLS - 1 ? index + 1 : index,
      ArrowLeft: col > 0 ? index - 1 : index,
      ArrowDown: row < ROWS - 1 ? index + COLS : index,
      ArrowUp: row > 0 ? index - COLS : index,
      Home: row * COLS,
      End: row * COLS + COLS - 1,
    };

    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    setFocusIndex(next);
    nodeRefs.current[next]?.focus();
  }, []);

  return (
    <div className="rounded-(--radius-surface) border border-edge bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight">
            Signal grid
          </h3>
          <p className="mt-1 max-w-[48ch] text-sm text-muted">
            {phase === "dark"
              ? "The grid is unpowered. Switch it on."
              : phase === "lit"
                ? "Three nodes are drifting out of phase with the rest. Lock them."
                : "Synchronised. Nice find."}
          </p>
        </div>

        {phase === "solved" ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-edge bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            <ArrowCounterClockwiseIcon weight="bold" className="size-4" />
            Reset
          </button>
        ) : (
          <button
            type="button"
            onClick={power}
            disabled={phase === "lit"}
            className="inline-flex items-center gap-2 rounded-full border border-edge bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-50"
          >
            <LightbulbIcon weight="bold" className="size-4" />
            {phase === "lit" ? `${found.length} / ${TARGET_COUNT} locked` : "Power on"}
          </button>
        )}
      </div>

      <div
        ref={gridRef}
        role="group"
        aria-label="Signal grid puzzle"
        // `auto` columns rather than `1fr`: the nodes should sit as a tight
        // field, not stretch to the panel's full width with the gaps doing all
        // the work.
        className="mx-auto mt-6 grid w-fit gap-2 md:gap-3"
        style={{ gridTemplateColumns: `repeat(${COLS}, auto)` }}
      >
        {Array.from({ length: TOTAL }, (_, index) => {
          const isTarget = targets.includes(index);
          const isFound = found.includes(index);
          const isLit = phase !== "dark";

          return (
            <button
              key={index}
              type="button"
              ref={(element) => {
                nodeRefs.current[index] = element;
              }}
              // In the dark phase the grid is inert, so Tab should skip it
              // entirely and land on the power switch.
              tabIndex={phase === "dark" ? -1 : index === focusIndex ? 0 : -1}
              // Deliberately `aria-disabled` rather than `disabled`. A real
              // `disabled` attribute on the button the user just activated
              // drops focus to <body>, which ejects a keyboard player from the
              // grid the moment they lock their first node — arrow keys stop
              // working and there is no way back in without re-Tabbing. The
              // click and key handlers already no-op on found nodes.
              aria-disabled={isFound || undefined}
              onFocus={() => setFocusIndex(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              onClick={() => select(index)}
              aria-label={
                isFound
                  ? `Node ${index + 1}, locked`
                  : isLit && isTarget
                    ? `Node ${index + 1} of ${TOTAL}, out of phase`
                    : `Node ${index + 1} of ${TOTAL}`
              }
              className={cn(
                "size-5 rounded-[3px] transition-colors md:size-6",
                isFound
                  ? "bg-accent ring-2 ring-accent-soft"
                  : isLit
                    ? "bg-edge-strong hover:bg-accent-ink"
                    : "bg-edge",
                // Without animation the targets must still be distinguishable,
                // or a reduced-motion player is staring at 45 identical squares
                // with no way through. Slightly brighter, statically.
                isLit && isTarget && !isFound && "motion-reduce:bg-muted",
              )}
              style={
                isLit && !isFound
                  ? {
                      animation: `phase-breathe ${isTarget ? "2.9s" : "1.8s"} ease-in-out infinite`,
                      ...(wrong === index
                        ? { animation: "phase-nudge 0.4s ease-in-out" }
                        : {}),
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/*
       * Every state change is announced. `polite` so it queues behind whatever
       * the user is already reading rather than interrupting mid-word.
       */}
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
