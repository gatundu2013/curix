import { pgTable, uuid, numeric, varchar, timestamp } from "drizzle-orm/pg-core";
import { roundStatusEnum } from "./enums";

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalStake: numeric("total_stake", { precision: 12, scale: 2 }).default("0"),
  totalBets: numeric("total_bets", { precision: 10, scale: 0 }).default("0"),
  totalPayout: numeric("total_payout", { precision: 12, scale: 2 }).default("0"),
  totalCashouts: numeric("total_cashouts", { precision: 10, scale: 0 }).default("0"),
  profit: numeric("profit", { precision: 12, scale: 2 }).default("0"),
  crashMultiplier: numeric("crash_multiplier", { precision: 10, scale: 2 }).notNull(),
  serverSeed: varchar("server_seed", { length: 64 }).notNull(),
  hashedServerSeed: varchar("hashed_server_seed", { length: 64 }).notNull(),
  clientSeed: varchar("client_seed", { length: 60 }),
  roundStatus: roundStatusEnum("round_status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
