import * as z from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
