import type { SchemaTypeDefinition } from "sanity";

import { about } from "./about";
import { education } from "./education";
import { project } from "./project";
import { role } from "./role";
import { skillGroup } from "./skillGroup";

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  role,
  education,
  skillGroup,
  about,
];
