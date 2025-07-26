import { pgTable, uuid, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { transactionTypeEnum } from "./enums";
import { users } from "./users";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: transactionTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  balanceBefore: numeric("balance_before", {
    precision: 12,
    scale: 2,
  }).notNull(),
  balanceAfter: numeric("balance_after", { precision: 12, scale: 2 }).notNull(),
  referenceId: uuid("reference_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});
