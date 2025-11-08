import { pgTable, varchar, timestamp, boolean, integer, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./User.js";
import { documents } from "./Documents.js";


export const documentsPermissions = pgTable("document_permissions", {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    documentId: integer("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),

    permission: varchar("permission", { length: 50 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
},
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.documentId] }),
        };
    })
