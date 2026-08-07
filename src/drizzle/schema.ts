import { pgEnum, pgTable, serial, text, timestamp, integer, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const issueStatus = pgEnum("issue_status", ["todo", "done"]);

export const epics = pgTable("epics", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const issues = pgTable("issues", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text(),
  status: issueStatus().default("todo").notNull(),
  epicId: integer("epic_id").references(() => epics.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
