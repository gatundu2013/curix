import {
  pgTable,
  uuid,
  varchar,
  boolean,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull().unique(),
  balance: numeric("balance", { precision: 12, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
