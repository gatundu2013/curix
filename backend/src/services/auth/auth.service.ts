import { Request, Response } from "express";
import { RegisterPayload } from "../../validations";
import { db } from "../../db/connection";
import { users } from "../../db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateAuthTokens } from "../../utils";
import { UserDataRes } from "../../types/auth.types";

export async function registerService(params: RegisterPayload) {
  // TODO: Validate OTP -- Will be done later
  const { phoneNumber, username, password, otp, acceptedTerms } = params;

  // Ensure user has accepted terms and conditions before proceeding
  if (!acceptedTerms) {
    throw new Error("Terms and conditions must be accepted");
  }

  // Verify phone number is not already registered in the system
  const [existingUserByPhone] = await db
    .select()
    .from(users)
    .where(eq(users.phoneNumber, phoneNumber));

  if (existingUserByPhone) {
    throw new Error("Phone number already exists");
  }

  // Check username availability (case-insensitive to prevent duplicates)
  // Usernames are normalized to lowercase for consistent storage and comparison
  // This ensures "BRIAN", "brian", and "Brian" are treated as the same username
  const normalizedUsername = username.toLowerCase();
  const [existingUserByUsername] = await db
    .select()
    .from(users)
    .where(eq(users.username, normalizedUsername));

  if (existingUserByUsername) {
    throw new Error("Username already exists");
  }

  // Securely hash the user's password using bcrypt with salt rounds of 10
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user record with normalized username and initial balance
  const [newUser] = await db
    .insert(users)
    .values({
      username: normalizedUsername,
      phoneNumber,
      hashedPassword,
      balance: "0", // Initialize account with zero balance
    })
    .returning({ userId: users.id, accountBalance: users.balance });

  // Generate JWT access and refresh tokens for authentication
  const authTokens = generateAuthTokens({ userId: newUser.userId });

  // Prepare user data response with original case-sensitive username
  const userData: UserDataRes = {
    username, // Return original username (not normalized)
    phoneNumber,
    accountBalance: newUser.accountBalance as string,
  };

  // TODO: Cache user data in redis

  return { authTokens, userData };
}

export async function loginService(req: Request, res: Response) {
  console.log("Register controller");
}

export async function forgotPasswordService(req: Request, res: Response) {
  console.log("Register controller");
}

export async function resetPasswordService(req: Request, res: Response) {
  console.log("Register controller");
}
