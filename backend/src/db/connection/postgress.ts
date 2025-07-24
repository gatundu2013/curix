import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { envVariables } from "../../config";
import { icons } from "../../utils";

const pool = new Pool({ connectionString: envVariables.DATABASE_URL });

export const db = drizzle({ client: pool });

export async function connectDb(maxRetries = 5, delay = 1000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await db.execute(`SELECT 1`);
      console.log(`${icons.success} Database connected successfully:`);
      return;
    } catch (err: any) {
      attempt++;
      console.error(
        `${icons.error} Database connection failed (attempt ${attempt}):`,
        err
      );
      if (attempt >= maxRetries) {
        throw new Error("Max database connection attempts reached");
      }

      // Wait before retrying
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}
