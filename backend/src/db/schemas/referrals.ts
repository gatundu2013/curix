import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./users";

export const referralTable = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => userTable.id),
  invitedId: uuid("invited_id")
    .notNull()
    .references(() => userTable.id),
});
