import {
  pgTable,
  uuid,
  varchar,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 10 }).notNull().unique(),
  balance: numeric("balance", { precision: 12, scale: 2 }).default("0"),
  referralCode: varchar("referral_code", { length: 10 }).notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
