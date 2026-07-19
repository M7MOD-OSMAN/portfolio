import { NextStudio } from "next-sanity/studio";

import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

/** The Studio is a client-side app; nothing here needs per-request rendering. */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  // Sanity throws an opaque "Configuration must contain `projectId`" if the
  // Studio mounts without one, so explain the setup step instead.
  if (!isSanityConfigured) {
    return (
      <main style={{ padding: "3rem 1.5rem", maxWidth: "42rem", margin: "0 auto", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Sanity Studio isn&rsquo;t configured yet
        </h1>
        <p style={{ marginTop: "1rem" }}>
          The site is currently rendering the content bundled in{" "}
          <code>src/content</code>. To manage it here instead:
        </p>
        <ol style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
          <li>
            Create a project at <code>https://sanity.io/manage</code>.
          </li>
          <li>
            Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> to{" "}
            <code>.env.local</code>.
          </li>
          <li>
            Run <code>npm run sanity:seed</code> to import the existing content.
          </li>
        </ol>
        <p style={{ marginTop: "1rem" }}>
          See <code>docs/SANITY.md</code> for the full walkthrough.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
