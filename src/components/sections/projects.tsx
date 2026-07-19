import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/content";
import { featuredProjects, otherProjects } from "@/content";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { hostname } from "@/lib/url";
import { cn } from "@/lib/cn";

function Thumbnail({ project }: { project: Project }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.name} website`}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }

  // No live site to screenshot: a quiet monogram stands in.
  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-display text-4xl font-bold text-edge-strong">
        {project.name.slice(0, 2)}
      </span>
    </div>
  );
}

function CardLink({ project }: { project: Project }) {
  if (!project.url) return null;
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-xs text-muted transition-colors after:absolute after:inset-0 group-hover:text-accent-ink"
    >
      {hostname(project.url)}
      <ArrowUpRightIcon size={12} weight="bold" className="ml-1 inline" />
    </a>
  );
}

export function Projects() {
  const [lead, ...rest] = featuredProjects;

  return (
    <Section id="projects" className="scroll-mt-16 border-t border-edge">
      <Reveal>
        <SectionHeading>Selected work</SectionHeading>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Lead project spans the row and splits horizontally. */}
        <Reveal className="group relative flex flex-col overflow-hidden rounded-(--radius-surface) border border-edge bg-surface md:col-span-2 md:flex-row">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2 md:aspect-auto md:w-[55%]">
            <Thumbnail project={lead} />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 md:p-10">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {lead.name}
              </h3>
              <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">
                {lead.description}
              </p>
            </div>
            {lead.highlights ? (
              <ul className="flex flex-col gap-2">
                {lead.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="max-w-[52ch] text-sm leading-relaxed text-muted"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
              {lead.tech?.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-edge px-3 py-1 font-mono text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
            <CardLink project={lead} />
          </div>
        </Reveal>

        {rest.map((project, index) => (
          <Reveal
            key={project.name}
            delay={0.05 * (index + 1)}
            className="group relative flex flex-col overflow-hidden rounded-(--radius-surface) border border-edge bg-surface"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
              <Thumbnail project={project} />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                {project.tech?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-edge px-3 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <CardLink project={project} />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20">
        <h3 className="font-display text-xl font-bold tracking-tight">
          Also shipped
        </h3>
      </Reveal>

      <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((project, index) => (
          <Reveal
            key={project.name}
            delay={Math.min(index, 5) * 0.04}
            className="group relative flex gap-4"
          >
            <div
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-(--radius-control) border border-edge bg-surface-2",
              )}
            >
              <Thumbnail project={project} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">{project.name}</h4>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <CardLink project={project} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
