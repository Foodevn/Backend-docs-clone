import { pgTable, serial, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    isPrivate: boolean("is_private").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
