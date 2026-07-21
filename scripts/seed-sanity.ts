/**
 * Seeds a Sanity dataset from the bundled content in src/content.
 *
 * Usage:  npm run sanity:seed            (writes documents)
 *         npm run sanity:seed -- --dry   (prints what it would write)
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID and a SANITY_API_WRITE_TOKEN with
 * Editor permissions in .env.local.
 *
 * Documents use deterministic ids, so re-running updates the same documents
 * rather than creating duplicates. Screenshots already in public/ are uploaded
 * as Sanity assets; run this before deleting anything from public/images.
 */
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { education, roles } from "../src/content/experience.ts";
import { projects } from "../src/content/projects.ts";
import { skillGroups } from "../src/content/skills.ts";
import { about } from "../src/content/about.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local first.",
  );
  process.exit(1);
}

if (!token && !DRY_RUN) {
  console.error(
    "SANITY_API_WRITE_TOKEN is not set. Create one at https://sanity.io/manage (API > Tokens, Editor role).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-01",
  useCdn: false,
});

/**
 * Stable, readable document id derived from a natural key.
 *
 * Joined with `-`, never `.`: Sanity treats a dot as a path separator, and the
 * default public read grant is scoped to `_id in path("*")`, which matches only
 * single-segment ids. A `role.foo` id is read as nested and stays invisible to
 * unauthenticated readers — i.e. to the site itself.
 */
function idFor(type: string, key: string) {
  const slug = key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${type}-${slug}`;
}

/** Uploads a /public screenshot once and returns an image field value. */
async function uploadImage(publicPath: string) {
  const filePath = path.join(ROOT, "public", publicPath);
  const filename = path.basename(publicPath);

  if (DRY_RUN) {
    console.log(`   would upload ${publicPath}`);
    return undefined;
  }

  // Reuse an identically-named asset so re-runs don't pile up duplicates.
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename },
  );

  const assetId =
    existing?._id ??
    (await client.assets.upload("image", await readFile(filePath), { filename }))
      ._id;

  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

async function seed() {
  const documents: Record<string, unknown>[] = [];

  console.log(
    `\nSeeding project ${projectId} / ${dataset}${DRY_RUN ? " (dry run)" : ""}\n`,
  );

  console.log("Projects");
  for (const [index, project] of projects.entries()) {
    console.log(`   ${project.name}`);
    documents.push({
      _id: idFor("project", project.name),
      _type: "project",
      name: project.name,
      url: project.url,
      description: project.description,
      highlights: project.highlights,
      tech: project.tech,
      featured: project.featured,
      order: index,
      ...(project.image ? { image: await uploadImage(project.image) } : {}),
    });
  }

  console.log("\nRoles");
  for (const role of roles) {
    console.log(`   ${role.title} at ${role.company}`);
    documents.push({
      _id: idFor("role", `${role.company}-${role.start}`),
      _type: "role",
      company: role.company,
      location: role.location,
      title: role.title,
      start: role.start,
      // Sanity omits null; an absent `end` is what marks the current role.
      ...(role.end ? { end: role.end } : {}),
      sideEngagement: role.sideEngagement ?? false,
      highlights: role.highlights,
      tech: role.tech,
    });
  }

  console.log("\nEducation");
  for (const item of education) {
    console.log(`   ${item.degree}`);
    documents.push({
      _id: idFor("education", item.institution),
      _type: "education",
      institution: item.institution,
      degree: item.degree,
      start: item.start,
      end: item.end,
    });
  }

  console.log("\nSkill groups");
  for (const [index, group] of skillGroups.entries()) {
    console.log(`   ${group.label}`);
    documents.push({
      _id: idFor("skillGroup", group.label),
      _type: "skillGroup",
      label: group.label,
      items: group.items,
      order: index,
    });
  }

  // Singleton: a fixed id, so re-seeding updates the one About document
  // rather than accumulating duplicates the way a name-derived id would.
  console.log("\nAbout");
  documents.push({
    _id: "about",
    _type: "about",
    body: about.body,
    backgroundWord: about.backgroundWord,
  });

  if (DRY_RUN) {
    console.log(`\nDry run: ${documents.length} documents would be written.`);
    return;
  }

  // One transaction so a mid-way failure doesn't leave the dataset half-seeded.
  const tx = client.transaction();
  for (const doc of documents) {
    tx.createOrReplace(doc as never);
  }
  await tx.commit();

  console.log(`\nWrote ${documents.length} documents.`);
  console.log("Open /studio to review them.\n");
}

seed().catch((error) => {
  console.error("\nSeeding failed.\n", error);
  process.exit(1);
});
