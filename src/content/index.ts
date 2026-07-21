/**
 * Bundled content. `profile` is authored here; projects, experience and skills
 * are managed in Sanity and only fall back to these files — read them through
 * the loaders in `./loaders` (server-only) rather than importing them directly.
 */
export * from "./types";
export { profile } from "./profile";
export { roles, education } from "./experience";
export { projects } from "./projects";
export { skillGroups } from "./skills";
