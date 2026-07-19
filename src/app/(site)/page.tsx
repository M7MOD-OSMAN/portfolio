import { profile } from "@/content";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <footer className="border-t border-edge">
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
