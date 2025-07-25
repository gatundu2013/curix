import { Request, Response } from "express";
import { RegisterPayload, RequestOtpPayload } from "../../validations";
import { db } from "../../db/connection";
import { users } from "../../db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateAuthTokens } from "../../utils";
import { UserDataRes } from "../../types/auth.types";
import { OtpService } from "../otp/otp.service";
import { OTP_PURPOSE } from "../../types";

const otpService = new OtpService();

export class AuthService {
  constructor() {}

  async register(params: RegisterPayload) {
    const { phoneNumber, username, password, otp, acceptedTerms } = params;

    const isOtpValid = otpService.validateOtp({
      phoneNumber,
      purpose: OTP_PURPOSE.REGISTER,
      otp,
    });

    if (!isOtpValid) {
      throw new Error("Invalid Otp");
    }

    if (!acceptedTerms) {
      throw new Error("Terms and conditions must be accepted");
    }

    const [existingUserByPhone] = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (existingUserByPhone) {
      throw new Error("Phone number already exists");
    }

    const normalizedUsername = username.toLowerCase();
    const [existingUserByUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, normalizedUsername));

    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        username: normalizedUsername,
        phoneNumber,
        hashedPassword,
        balance: "0",
      })
      .returning({ userId: users.id, accountBalance: users.balance });

    const authTokens = generateAuthTokens({ userId: newUser.userId });

    const userData: UserDataRes = {
      username, // Return original case
      phoneNumber,
      accountBalance: newUser.accountBalance as string,
    };

    // TODO: Cache user data in redis
    return {
      success: true,
      message: "Registered successfully",
      authTokens,
      userData,
    };
  }

  async requestOtp(params: RequestOtpPayload) {
    const { otpPurpose, phoneNumber } = params;

    await otpService.generateOtp({ phoneNumber, purpose: otpPurpose });

    return {
      success: true,
      message: "Otp sent successfully",
    };
  }

  async login(req: Request, res: Response) {
    console.log("Login service");
  }

  async forgotPassword(req: Request, res: Response) {
    console.log("Forgot Password service");
  }

  async resetPassword(req: Request, res: Response) {
    console.log("Reset Password service");
  }
}
