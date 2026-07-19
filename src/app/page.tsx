import { profile, roles, skillGroups, visibleProjects } from "@/content";

// Temporary placeholder page: proves the content layer end-to-end while the
// design system and real sections are built in upcoming milestones.
export default function Home() {
  const currentRole = roles.find((role) => role.end === null);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          {profile.name}
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400">
          {profile.title}
          {currentRole ? ` · ${currentRole.company}` : null}
        </p>
        <p className="max-w-prose leading-relaxed">{profile.summary}</p>
        <ul className="flex gap-4 text-sm">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                className="underline underline-offset-4 hover:no-underline"
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="underline underline-offset-4 hover:no-underline"
              href={`mailto:${profile.email}`}
            >
              Email
            </a>
          </li>
        </ul>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
        <ul className="flex flex-col gap-2">
          {roles.map((role) => (
            <li key={`${role.company}-${role.start}`}>
              <span className="font-medium">{role.title}</span> — {role.company}
              , {role.location} ({role.start} → {role.end ?? "present"})
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        <ul className="flex flex-col gap-2">
          {visibleProjects.map((project) => (
            <li key={project.name}>
              {project.url ? (
                <a
                  className="font-medium underline underline-offset-4 hover:no-underline"
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </a>
              ) : (
                <span className="font-medium">{project.name}</span>
              )}{" "}
              — {project.description}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <ul className="flex flex-col gap-2">
          {skillGroups.map((group) => (
            <li key={group.label}>
              <span className="font-medium">{group.label}:</span>{" "}
              {group.items.join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
