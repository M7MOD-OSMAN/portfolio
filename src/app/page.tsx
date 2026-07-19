import { profile, roles, skillGroups, visibleProjects } from "@/content";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

// Experience, Projects, and Skills below are still placeholder layouts;
// their real designs land in the upcoming milestones.
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />

        <Section id="experience" className="scroll-mt-16 border-t border-edge">
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
                    {role.start} - {role.end ?? "now"}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="projects" className="scroll-mt-16 border-t border-edge">
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

        <Section id="skills" className="scroll-mt-16 border-t border-edge">
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

      <footer id="contact" className="scroll-mt-16 border-t border-edge">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-accent-ink underline-offset-4 hover:underline"
              >
                {social.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className="text-accent-ink underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
