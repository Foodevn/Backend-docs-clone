import dotenv from "dotenv";
dotenv.config(); // Load env variables trước

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

import * as schema from "./schema.js";

// Kiểm tra DATABASE_URL
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables. Please check your .env file.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Kiểm tra kết nối với Drizzle
export const testDrizzleConnection = async () => {
    try {
        // Test với raw SQL
        const result = await db.execute(sql`SELECT 1 as test`);
        console.log("Drizzle connection successful:", result.rows[0].test);

    } catch (error) {
        console.error("Drizzle connection failed:", error.message);
        throw error;
    }
};