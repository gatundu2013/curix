import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { envVariables } from "../../config";
import { icons } from "../../utils";

const pool = new Pool({ connectionString: envVariables.DATABASE_URL });

export const db = drizzle({ client: pool });

export async function connectDb() {
  try {
    await db.execute(`SELECT 1`);
    console.log(`${icons.success} Database connected successfully:`);
  } catch (err) {
    console.error(`${icons.error} Database connection failed:`);
    throw err;
  }
}
