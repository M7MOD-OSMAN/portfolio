import { profile, roles, skillGroups, visibleProjects } from "@/content";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Placeholder page demonstrating the design system end-to-end.
// Real section designs land in the upcoming milestones.
export default function Home() {
  const currentRole = roles.find((role) => role.end === null);

  return (
    <>
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <span className="font-display text-lg font-bold tracking-tight">
          {profile.name}
        </span>
        <ThemeToggle />
      </header>

      <main className="flex-1">
        <Section className="py-16 md:py-24">
          <div className="flex max-w-2xl flex-col gap-6">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
              {profile.title}
              {currentRole ? (
                <span className="block text-muted">
                  at {currentRole.company}
                </span>
              ) : null}
            </h1>
            <p className="max-w-[65ch] leading-relaxed text-muted">
              {profile.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={`mailto:${profile.email}`}>
                Get in touch
              </ButtonLink>
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-accent-ink underline-offset-4 hover:underline"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </Section>

        <Section className="border-t border-edge">
          <Reveal>
            <SectionHeading>Experience</SectionHeading>
          </Reveal>
          <ul className="mt-10 flex flex-col divide-y divide-edge">
            {roles.map((role) => (
              <li key={`${role.company}-${role.start}`}>
                <Reveal className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between">
                  <div>
                    <span className="font-medium">{role.title}</span>
                    <span className="text-muted"> · {role.company}</span>
                  </div>
                  <span className="font-mono text-sm text-muted">
                    {role.start} – {role.end ?? "now"}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>

        <Section className="border-t border-edge">
          <Reveal>
            <SectionHeading>Projects</SectionHeading>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleProjects.map((project, i) => (
              <Reveal
                key={project.name}
                delay={i * 0.05}
                className="flex flex-col gap-2 rounded-(--radius-surface) border border-edge bg-surface p-6"
              >
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-lg font-bold tracking-tight hover:text-accent-ink"
                  >
                    {project.name}
                  </a>
                ) : (
                  <span className="font-display text-lg font-bold tracking-tight">
                    {project.name}
                  </span>
                )}
                <p className="text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section className="border-t border-edge">
          <Reveal>
            <SectionHeading>Skills</SectionHeading>
          </Reveal>
          <div className="mt-10 flex flex-col gap-6">
            {skillGroups.map((group) => (
              <Reveal
                key={group.label}
                className="flex flex-col gap-2 md:flex-row md:gap-10"
              >
                <span className="w-48 shrink-0 font-medium">{group.label}</span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-edge px-3 py-1 text-sm text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-edge">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            {profile.location} ·{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-accent-ink underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
