import { getEducation, getRoles } from "@/content/loaders";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { formatRange } from "@/lib/date";
import { cn } from "@/lib/cn";

export async function Experience() {
  const [roles, education] = await Promise.all([getRoles(), getEducation()]);

  return (
    <Section id="experience" className="scroll-mt-16 border-t border-edge">
      <Reveal>
        <SectionHeading>Experience</SectionHeading>
      </Reveal>

      <ol className="mt-12 flex flex-col">
        {roles.map((role, index) => {
          const isCurrent = role.end === null;
          const isLast = index === roles.length - 1;

          return (
            <li key={role.id ?? `${role.company}-${role.start}`}>
              <Reveal className="grid gap-x-10 md:grid-cols-[10rem_minmax(0,1fr)]">
                <div className="flex flex-col gap-1 pb-3 md:pt-0.5 md:pb-0">
                  <span className="font-mono text-sm text-muted">
                    {formatRange(role.start, role.end)}
                  </span>
                  {role.sideEngagement ? (
                    <span className="text-xs text-muted">
                      Concurrent engagement
                    </span>
                  ) : null}
                </div>

                <div
                  className={cn(
                    "relative border-l pl-8 pb-14",
                    isLast ? "border-transparent" : "border-edge",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1.5 -left-[5px] size-2.5 rounded-full",
                      isCurrent
                        ? "bg-accent ring-4 ring-accent-soft"
                        : "bg-edge-strong",
                    )}
                  />

                  <h3 className="font-display text-xl font-bold tracking-tight">
                    {role.title}
                  </h3>
                  <p className="mt-1 text-muted">
                    {role.company}
                    <span className="text-edge-strong"> / </span>
                    {role.location}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {role.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="max-w-[68ch] text-sm leading-relaxed text-muted"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {role.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-edge bg-surface px-3 py-1 font-mono text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>

      {education.map((item) => (
        <Reveal
          key={item.id ?? item.institution}
          className="mt-4 flex flex-col gap-x-10 gap-y-1 border-t border-edge pt-8 md:grid md:grid-cols-[10rem_minmax(0,1fr)]"
        >
          <span className="font-mono text-sm text-muted">
            {formatRange(item.start, item.end)}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {item.degree}
            </h3>
            <p className="mt-1 text-muted">{item.institution}</p>
          </div>
        </Reveal>
      ))}
    </Section>
  );
}
