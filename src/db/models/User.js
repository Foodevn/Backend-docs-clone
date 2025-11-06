import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    avatarId: varchar("avatar_id", { length: 255 }),
    bio: text("bio"), // hoặc varchar("bio", { length: 500 }) nếu muốn giới hạn
    phone: varchar("phone", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
