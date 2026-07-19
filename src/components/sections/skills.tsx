import { profile, roles, skillGroups } from "@/content";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

export function Skills() {
  const currentRole = roles.find((role) => role.end === null);

  return (
    <Section id="skills" className="scroll-mt-16 border-t border-edge">
      <Reveal>
        <SectionHeading>Skills</SectionHeading>
      </Reveal>

      <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
        <div className="md:sticky md:top-28 md:self-start">
          <dl className="flex flex-col gap-6 text-sm">
            <div>
              <dt className="font-mono text-xs tracking-wide text-muted">
                Based in
              </dt>
              <dd className="mt-1">{profile.location}</dd>
            </div>

            {currentRole ? (
              <div>
                <dt className="font-mono text-xs tracking-wide text-muted">
                  Working in
                </dt>
                <dd className="mt-1">{currentRole.tech.join(", ")}</dd>
              </div>
            ) : null}

            <div>
              <dt className="font-mono text-xs tracking-wide text-muted">
                Languages
              </dt>
              <dd className="mt-1 flex flex-col gap-1">
                {profile.languages.map((language) => (
                  <span key={language.name}>
                    {language.name}
                    <span className="text-muted"> ({language.level})</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col">
          {skillGroups.map((group, index) => {
            const isLead = index === 0;

            return (
              <Reveal
                key={group.label}
                delay={index * 0.05}
                className={cn(
                  "flex flex-col gap-4 py-7 md:flex-row md:gap-10",
                  index > 0 && "border-t border-edge",
                  index === 0 && "pt-0",
                )}
              >
                <h3 className="w-40 shrink-0 pt-1 font-medium">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={cn(
                        "rounded-full border px-3 py-1.5 font-mono text-xs",
                        isLead
                          ? "border-edge-strong bg-surface text-foreground"
                          : "border-edge text-muted",
                      )}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
