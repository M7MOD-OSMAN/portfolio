import { profile, skillGroups } from "@/content";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

// The Skills section below is still a placeholder layout;
// its real design lands in the next milestone.
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />

        <Experience />

        <Projects />

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
