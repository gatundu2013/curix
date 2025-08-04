import {
  pgTable,
  uuid,
  numeric,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { withdrawalStatusEnum } from "./enums";
import { userTable } from "./users";

export const withdrawalTable = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: withdrawalStatusEnum("status").default("PENDING"),
  mpesaTransactionId: varchar("mpesa_transaction_id", { length: 20 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
});
