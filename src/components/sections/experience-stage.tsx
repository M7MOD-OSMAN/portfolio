"use client";

import { useMotionEnhancement } from "@/components/motion/use-motion-enhancement";
import { ExperienceOrbit } from "@/components/sections/experience-orbit";
import type { Role } from "@/content/types";

/**
 * Chooses between the baseline timeline and the pinned set-piece.
 *
 * The timeline arrives as `children` already rendered on the server, so the
 * HTML that ships — and everything a crawler or a JS-less client sees — is the
 * plain, complete list of roles. The orbit only replaces it after mount, and
 * only where `useMotionEnhancement` says a pin is safe.
 */
export function ExperienceStage({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const enhanced = useMotionEnhancement();

  return enhanced ? <ExperienceOrbit roles={roles} /> : <>{children}</>;
}
