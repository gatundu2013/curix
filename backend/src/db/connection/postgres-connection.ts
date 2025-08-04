import { Pool } from "pg";
import { envVariables } from "../../config/env-config";
import { drizzle } from "drizzle-orm/node-postgres";
import { ICONS } from "../../utils/icons-utils";

const pool = new Pool({ connectionString: envVariables.DATABASE_URL });
const db = drizzle({ client: pool });

export async function connectDb(maxRetries = 5) {
  let retries = 1;

  while (retries <= maxRetries) {
    try {
      await db.execute(`SELECT 1`);
      console.log(`${ICONS.success} Database connected successfully`);
      return;
    } catch (err: any) {
      console.error(`${ICONS.error} Database connection retry - ${retries}`);

      if (retries === maxRetries) {
        console.error(`${ICONS.error} Database connection failed`, err.cause);
        throw new Error("Database connection failed");
      }

      const delay = 1000 * Math.pow(2, retries);
      await new Promise((res) => setTimeout(res, delay));

      retries += 1;
    }
  }
}
