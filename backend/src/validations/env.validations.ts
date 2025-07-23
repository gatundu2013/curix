import * as z from "zod";

export const envVariablesSchema = z.looseObject({
  PORT: z.coerce.number("PORT is required"),
});

export type EnvVariablesType = z.infer<typeof envVariablesSchema>;
