import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  issues: {
    epic: r.one.epics({
      from: r.issues.epicId,
      to: r.epics.id,
    }),
  },
  epics: {
    issues: r.many.issues(),
  },
}));
