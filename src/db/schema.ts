import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const repos = pgTable("repos", {
    id: text("id").primaryKey(),          // "{owner}/{name}"
    name: text("name").notNull(),
    owner: text("owner").notNull(),
    stars: integer("stars").notNull(),
    forks: integer("forks").notNull(),
    language: text("language"),
    description: text("description"),
    htmlUrl: text("html_url"),
    updatedAt: timestamp("updated_at").notNull(),
    syncedAt: timestamp("synced_at").defaultNow(),
});

export const issues = pgTable("issues", {
    id: integer("id").primaryKey(),       // GitHub issue number (unique per repo)
    repoId: text("repo_id").notNull().references(() => repos.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    title: text("title").notNull(),
    state: text("state").notNull(),       // "open" | "closed"
    body: text("body"),
    htmlUrl: text("html_url").notNull(),
    isPullRequest: boolean("is_pull_request").default(false),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    syncedAt: timestamp("synced_at").defaultNow(),
});