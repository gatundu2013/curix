import { pgEnum } from "drizzle-orm/pg-core";

export const roundStatusEnum = pgEnum("round_status", ["PENDING", "RUNNING", "ENDED"]);
export const betStatusEnum = pgEnum("bet_status", ["PENDING", "WON", "LOST", "CASHED_OUT"]);
export const depositStatusEnum = pgEnum("deposit_status", ["PENDING", "COMPLETED", "FAILED"]);
export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["PENDING", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "DEPOSIT",
  "WITHDRAWAL",
  "BET_PLACED",
  "BET_PAYOUT",
  "BET_CASHOUT",
  "REFERRAL_BONUS"
]);
