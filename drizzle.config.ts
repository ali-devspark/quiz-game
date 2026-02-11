// import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./lib/db/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        token: process.env.DATABASE_AUTH_TOKEN,
    },
});
