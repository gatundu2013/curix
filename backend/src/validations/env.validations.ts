import * as z from "zod";

export const envVariablesSchema = z.looseObject({
  PORT: z.coerce.number("PORT is required"),
  DATABASE_URL: z.coerce.string("DATABASE_URL is required"),
});

export type EnvVariablesType = z.infer<typeof envVariablesSchema>;
