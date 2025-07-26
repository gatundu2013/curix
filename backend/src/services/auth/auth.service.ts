import {
  RegisterPayload,
  RequestOtpPayload,
  LoginPayload,
  ResetPasswordPayload,
} from "../../validations";
import { db } from "../../db/connection";
import { users } from "../../db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateAuthTokens } from "../../utils";
import { UserDataRes } from "../../types/auth.types";
import { OtpService } from "../otp/otp.service";
import { OTP_PURPOSE } from "../../types";

// OTP service instance for authentication operations
const otpService = new OtpService();

/**
 * Handles business logic for user authentication operations.
 * Manages user registration, login, password reset, and OTP requests.
 */
export class AuthService {
  constructor() {}

  /**
   * Registers a new user with phone number verification via OTP
   * Performs comprehensive validation including duplicate checks and OTP verification
   *
   * @param params - Registration payload containing user details and OTP
   * @returns Object containing success message, authentication tokens, and user data
   * @throws Error if validation fails, user already exists, or OTP is invalid
   */
  async register(params: RegisterPayload) {
    const { phoneNumber, username, password, otp, acceptedTerms } = params;

    // Validate that user has accepted terms and conditions
    if (!acceptedTerms) {
      throw new Error("Terms and conditions must be accepted");
    }

    // Check if phone number is already registered
    const [existingUserByPhone] = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (existingUserByPhone) {
      throw new Error("Phone number already exists");
    }

    // Check if username is already taken (case-insensitive)
    // Example "brian" "BRIAN" "Brian" are considered the same
    const normalizedUsername = username.toLowerCase();
    const [existingUserByUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, normalizedUsername));

    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    // Validate the provided OTP against stored value
    const isOtpValid = await otpService.validateOtp({
      phoneNumber,
      purpose: OTP_PURPOSE.REGISTER,
      otp,
    });

    if (!isOtpValid) {
      throw new Error("Invalid Otp");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database with initial balance of 0
    const [newUser] = await db
      .insert(users)
      .values({
        username: normalizedUsername,
        phoneNumber,
        hashedPassword,
        balance: "0",
      })
      .returning({ userId: users.id, accountBalance: users.balance });

    // Generate JWT tokens for authenticated session
    const authTokens = generateAuthTokens({ userId: newUser.userId });

    // Prepare user data for response (preserve original username case)
    const userData: UserDataRes = {
      username, // Return original case
      phoneNumber,
      accountBalance: newUser.accountBalance as string,
    };

    // TODO: Cache user data in redis

    return {
      message: "Registered successfully",
      authTokens,
      userData,
    };
  }

  /**
   * Requests an OTP to be sent to the specified phone number
   * Handles rate limiting and OTP generation through the OTP service
   *
   * @param params - OTP request payload containing phone number and purpose
   * @returns Object containing success message and generated OTP
   * @throws Error if rate limit is exceeded or OTP generation fails
   */
  async requestOtp(params: RequestOtpPayload) {
    const { otpPurpose, phoneNumber } = params;

    // Generate and send OTP through the OTP service
    const otp = await otpService.generateOtp({
      phoneNumber,
      purpose: otpPurpose,
    });

    return {
      message: "Otp sent successfully",
      otp,
    };
  }

  /**
   * Authenticates a user with phone number and password
   *
   * @param params - Login payload containing phone number and password
   * @returns Object containing authentication tokens and user data
   * @throws Error if credentials are invalid or user is not found
   */
  async login(params: LoginPayload) {
    console.log("Login service");
    // TODO: Implement login logic
    // 1. Validate phoneNumber and password
    // 2. Check if user exists and is active
    // 3. Compare password hash
    // 4. Generate new auth tokens
    // 5. Return user data and tokens
  }

  /**
   * Resets user password using OTP verification
   * Validates OTP and updates password hash in database
   *
   * @param params - Reset password payload containing phone number, new password and OTP
   * @returns Object containing success message
   * @throws Error if OTP is invalid or password update fails
   */
  async resetPassword(params: ResetPasswordPayload) {
    console.log("Reset Password service");
    // TODO: Implement reset password logic
    // 1. Validate OTP for password reset
    // 2. Hash new password
    // 3. Update user password in database
    // 4. Invalidate old sessions/tokens
    // 5. Return success message
  }

  /**
   * Logs out a user by invalidating their authentication tokens
   * Clears user session and invalidates refresh tokens
   *
   * @param userId - The ID of the user to logout
   * @returns Object containing success message
   * @throws Error if logout process fails
   */
  async logout(userId: string) {
    console.log("Logout service");
    // TODO: Implement logout logic
    // 1. Invalidate refresh token in Redis/database
    // 2. Clear any cached user data
    // 3. Log logout activity
    // 4. Return success message
  }
}
