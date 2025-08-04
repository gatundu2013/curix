import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { roundTable } from "./rounds";

export const clientSeedTable = pgTable("client_seeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientSeed: varchar("client_seed", { length: 20 }).notNull(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => roundTable.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
});
