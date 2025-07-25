import * as z from "zod";

export const envVariablesSchema = z.looseObject({
  PORT: z.coerce.number("PORT is required"),
  DATABASE_URL: z.coerce.string("DATABASE_URL is required"),
  REDIS_URL: z.coerce.string("REDIS_URL is required"),
  JWT_ACCESS_SECRET: z.coerce.string("JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.coerce.string("JWT_REFRESH_SECRET is required"),
});

export type EnvVariablesType = z.infer<typeof envVariablesSchema>;
