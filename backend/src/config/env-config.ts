import path from "path";
import { existsSync } from "fs";
import { envSchema, EnvType } from "../validations/env-validations";
import { ICONS } from "../utils/icons-utils";
import dotenv from "dotenv";

export const envFile = `.env.${process.env.NODE_ENV || "development"}`;
export const envFilePath = path.resolve(process.cwd(), envFile);

if (!existsSync(envFilePath)) {
  console.error(`${ICONS.error} Environment file not found at: ${envFilePath}`);
  process.exit(1);
}

dotenv.config({ path: envFilePath });
const { error, success, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error(
    `${ICONS.error} Environment validation failed: ${error.issues[0].message}`
  );
  process.exit(1);
}

console.log(`${ICONS.success} Environment variables loaded successfully`);

export const envVariables: EnvType = data;
