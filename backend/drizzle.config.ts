import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import "./src/config/env.config";

export default defineConfig({
  out: "./src/db/drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
