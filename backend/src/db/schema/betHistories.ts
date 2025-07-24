import { pgTable, uuid, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { betStatusEnum } from "./enums";
import { users } from "./users";
import { rounds } from "./rounds";

export const betHistories = pgTable("bet_histories", {
  id: uuid("id").primaryKey().defaultRandom(),
  stake: numeric("stake", { precision: 12, scale: 2 }).notNull(),
  cashedOutMultiplier: numeric("cashed_out_multiplier", { precision: 10, scale: 2 }),
  payout: numeric("payout", { precision: 12, scale: 2 }),
  status: betStatusEnum("status").default("PENDING"),
  cashOutTime: timestamp("cash_out_time"),
  autoCashoutMultiplier: numeric("auto_cashout_multiplier", { precision: 12, scale: 2 }),
  isAuto: boolean("is_auto").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  roundId: uuid("round_id").references(() => rounds.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
});
