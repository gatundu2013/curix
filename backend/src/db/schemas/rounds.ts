import {
  pgTable,
  uuid,
  numeric,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { roundStatusEnum } from "./enums";

export const roundTable = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalStake: numeric("total_stake", { precision: 12, scale: 2 }).default(
    "0.00"
  ),
  totalBets: integer("total_bets").default(0),
  totalPayout: numeric("total_payout", { precision: 12, scale: 2 }).default(
    "0.00"
  ),
  totalCashouts: integer("total_cashouts").default(0),
  profit: numeric("profit", { precision: 12, scale: 2 }).default("0.00"),
  crashMultiplier: numeric("crash_multiplier", {
    precision: 10,
    scale: 2,
  }).notNull(),
  serverSeed: varchar("server_seed", { length: 64 }).notNull(),
  hashedServerSeed: varchar("hashed_server_seed", { length: 64 }).notNull(),
  clientSeed: varchar("client_seed", { length: 60 }),
  roundStatus: roundStatusEnum("round_status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
