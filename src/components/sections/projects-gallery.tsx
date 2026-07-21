"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRightIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";

import type { Project } from "@/content";
import { hostname } from "@/lib/url";
import { cn } from "@/lib/cn";

/** A project paired with its stable position in the full, ordered list. */
type NumberedProject = { project: Project; number: number };

function Thumbnail({ project }: { project: Project }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.name} website`}
        fill
        sizes="(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw"
        {...(project.blurDataURL
          ? { placeholder: "blur" as const, blurDataURL: project.blurDataURL }
          : {})}
        className="object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.04]"
      />
    );
  }

  // No live site to screenshot: a two-letter monogram stands in.
  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-display text-4xl font-bold text-edge-strong transition-transform duration-500 group-hover/card:scale-105">
        {project.name.slice(0, 2)}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  number,
  activeFilter,
}: {
  project: Project;
  number: number;
  activeFilter: string | null;
}) {
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <Thumbnail project={project} />

        <span className="absolute left-3 top-3 z-20 rounded-full border border-edge bg-background/60 px-2 py-0.5 font-mono text-xs text-muted backdrop-blur-sm">
          #{String(number).padStart(2, "0")}
        </span>

        {project.featured ? (
          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-accent-ink">
            <StarIcon size={10} weight="fill" />
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {project.category ? (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
            {project.category}
          </span>
        ) : null}

        <h3 className="font-display text-lg font-bold tracking-tight">
          {project.name}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {project.tech?.length ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[0.66rem] transition-colors",
                  tech === activeFilter
                    ? "border-accent/45 text-accent-ink"
                    : "border-edge text-muted",
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        {project.url ? (
          <span className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors group-hover/card:text-accent-ink">
            {hostname(project.url)}
            <ArrowUpRightIcon size={12} weight="bold" />
          </span>
        ) : null}
      </div>
    </>
  );

  // Hover-to-focus lives on this element (the card surface), separate from the
  // motion wrapper: motion writes an inline `opacity` while animating a filter
  // change, and an inline value beats a class — so the dim has to sit on an
  // element motion isn't animating, or the two silently cancel out.
  const cardClass = cn(
    "group/card relative flex h-full flex-col overflow-hidden rounded-(--radius-surface) border border-edge bg-surface transition duration-300",
    "hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_46px_-22px_rgba(0,0,0,0.7)]",
    // Dim the rest of the grid while any card is hovered.
    "group-hover/gallery:opacity-45 hover:opacity-100!",
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className={cardClass}
      >
        {body}
      </a>
    );
  }

  return <div className={cardClass}>{body}</div>;
}

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  // Number projects by their curated order once, so a card keeps its number
  // when the list is filtered down.
  const indexed = useMemo<NumberedProject[]>(
    () => projects.map((project, i) => ({ project, number: i + 1 })),
    [projects],
  );

  // Filter facets, derived from the tech tags themselves and ranked by how
  // many projects use each — so the stack you leaned on most sorts first.
  const facets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { project } of indexed) {
      for (const tech of project.tech ?? []) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [indexed]);

  const visible = active
    ? indexed.filter(({ project }) => project.tech?.includes(active))
    : indexed;

  const featuredCount = indexed.filter(
    ({ project }) => project.featured,
  ).length;

  return (
    <div className="mt-6">
      <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm text-muted">
        <span>
          <span className="text-foreground">{projects.length}</span> projects
        </span>
        <span className="text-edge-strong">/</span>
        <span>
          <span className="text-foreground">{featuredCount}</span> featured
        </span>
        <span className="text-edge-strong">/</span>
        <span>hover to focus</span>
        <span className="text-edge-strong">/</span>
        <span>click to open</span>
      </p>

      {/* Filter bar */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-edge py-4">
        <span className="mr-1 font-mono text-xs uppercase tracking-[0.1em] text-muted">
          Filter
        </span>

        <FilterChip
          label="All"
          count={projects.length}
          active={active === null}
          onClick={() => setActive(null)}
        />

        {facets.map(([tech, count]) => (
          <FilterChip
            key={tech}
            label={tech}
            count={count}
            active={active === tech}
            onClick={() => setActive(active === tech ? null : tech)}
          />
        ))}
      </div>

      {/* Grid */}
      <ul className="group/gallery mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map(({ project, number }) => (
            <motion.li
              key={project.id ?? project.name}
              layout={!reduce}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <ProjectCard
                project={project}
                number={number}
                activeFilter={active}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {visible.length === 0 ? (
        <p className="mt-8 font-mono text-sm text-muted">
          No projects use {active}.
        </p>
      ) : null}
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-colors",
        active
          ? "border-accent bg-accent font-semibold text-background"
          : "border-edge text-muted hover:border-edge-strong hover:text-foreground",
      )}
    >
      {label}
      <span className={active ? "text-background/55" : "text-edge-strong"}>
        {count}
      </span>
    </button>
  );
}
