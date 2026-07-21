/**
 * One-off migration: the seed script used to build ids as `type.slug`.
 * Sanity treats `.` as a path separator, so those documents fell outside the
 * default public read grant (`_id in path("*")`) and were invisible to the
 * site. The seed now emits `type-slug`, which created a second, readable copy
 * of every document.
 *
 * This script:
 *   1. copies the hand-edited Core skill items onto the new id
 *   2. deletes the 20 stale dotted documents
 *
 * Verified beforehand: 19 of the 20 pairs are byte-identical; `skillGroup.core`
 * is the only one carrying edits, handled explicitly in step 1.
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-07-01",
  useCdn: false,
});

const DRY_RUN = process.argv.includes("--dry");

const docs = await client.fetch<{ _id: string; items?: string[] }[]>(
  `*[_type in ["project","role","education","skillGroup"]]{_id, items}`,
);

const dotted = docs.filter((d) => d._id.includes("."));
const core = dotted.find((d) => d._id === "skillGroup.core");

console.log(`Found ${dotted.length} stale dotted documents.`);
if (core) console.log(`Preserving Core items: ${JSON.stringify(core.items)}`);

if (DRY_RUN) {
  console.log("\nDry run. Would patch skillGroup-core, then delete:");
  for (const d of dotted) console.log(`   ${d._id}`);
  process.exit(0);
}

const tx = client.transaction();
if (core?.items) tx.patch("skillGroup-core", (p) => p.set({ items: core.items }));
for (const d of dotted) tx.delete(d._id);
await tx.commit();

console.log(`\nPatched skillGroup-core and deleted ${dotted.length} documents.`);
