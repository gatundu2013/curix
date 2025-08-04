import {
  pgTable,
  uuid,
  numeric,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { depositStatusEnum } from "./enums";
import { userTable } from "./users";

export const depositTable = pgTable("deposits", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  mpesaTransactionId: varchar("mpesa_transaction_id", { length: 20 })
    .notNull()
    .unique(),
  status: depositStatusEnum("status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
});
