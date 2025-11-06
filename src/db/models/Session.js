import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./User.js";

export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").notNull().references(() => users.id),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
//todo: tự động xóa khi hết hạn
