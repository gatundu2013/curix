import * as z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
