import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { envVariablesSchema } from "../validations";
import { icons } from "../utils";

// Determine which .env file to use (e.g. .env.development, .env.production)
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
const envPath = path.resolve(process.cwd(), envFile);

// Check if the file exists
if (!fs.existsSync(envPath)) {
  console.error(`${icons.error} Env file not found: ${envPath}`);
  process.exit(1);
}

// Load the environment variables from the file
dotenv.config({ path: envPath });
console.log(`${icons.success} Loaded env file: ${envFile}`);

// Validate the loaded environment variables
const result = envVariablesSchema.safeParse(process.env);

if (!result.success) {
  console.error(`${icons.error} Missing environment variables:`);
  console.error(result.error.issues);
  process.exit(1);
}

console.log(
  `${icons.success} All required environment variables were successfully loaded.`
);

export const envVariables = result.data;
