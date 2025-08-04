import { pgEnum } from "drizzle-orm/pg-core";

// Round status enum
export const roundStatusEnum = pgEnum("round_status", [
  "PENDING",
  "RUNNING",
  "ENDED",
]);

// Bet status enum
export const betStatusEnum = pgEnum("bet_status", [
  "PENDING",
  "WON",
  "LOST",
  "CASHED_OUT",
]);

// Deposit status enum
export const depositStatusEnum = pgEnum("deposit_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);

// Withdrawal status enum
export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "PENDING",
  "APPROVED",
  "PROCESSING",
  "COMPLETED",
  "REJECTED",
]);

// Transaction type enum
export const transactionTypeEnum = pgEnum("transaction_type", [
  "DEPOSIT",
  "WITHDRAWAL",
  "BET_PLACED",
  "BET_PAYOUT",
  "BET_CASHOUT",
  "REFERRAL_BONUS",
]);
