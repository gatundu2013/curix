import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { rounds } from "./rounds";

export const clientSeeds = pgTable("client_seeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientSeed: varchar("client_seed", { length: 20 }).notNull(),
  roundId: uuid("round_id").references(() => rounds.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
});
