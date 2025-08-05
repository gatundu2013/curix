import crypto from "crypto";
import { redis } from "../../db/connection/redis-connection";
import { otpRedisKeys } from "../../utils/redis-keys/otp-redis-keys";
import { OTP_PURPOSE } from "../../types/shared/auth-types";

interface GenerateOtpParams {
  phoneNumber: string;
  purpose: OTP_PURPOSE;
}

export class OtpService {
  private readonly RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_OTP = 5;
  private readonly OTP_TTL_SECONDS = 5 * 60; // 5 minutes

  async generateOtp({ phoneNumber, purpose }: GenerateOtpParams) {
    const now = Date.now();
    const rateLimitKey = otpRedisKeys.getRateLimitKey({ phoneNumber });
    const otpKey = otpRedisKeys.getStorageKey({ phoneNumber, purpose });

    // Clean up old requests outside rate limit window
    const validWindow = now - this.RATE_LIMIT_WINDOW_MS;
    await redis.zremrangebyscore(rateLimitKey, 0, validWindow);

    // Count requests in current window
    const count = await redis.zcard(rateLimitKey);
    if (count >= this.MAX_OTP) {
      throw new Error("Too many OTP requests. Please try again later.");
    }

    // Generate OTP
    const otp = crypto.randomInt(1001, 9999);

    // Send OTP to phone number
    await this.sendOtp(phoneNumber, otp);

    // Rate limit otp
    await redis.zadd(rateLimitKey, now, crypto.randomUUID());
    if (count === 0) {
      await redis.expire(rateLimitKey, 1800);
    }

    // Set OTP with TTL (5 minutes)
    await redis.set(otpKey, otp.toString(), "EX", this.OTP_TTL_SECONDS);

    return {
      message: "OTP sent successfully",
    };
  }

  async validateOtp(params: {
    phoneNumber: string;
    purpose: OTP_PURPOSE;
    otp: string;
  }) {
    const { phoneNumber, purpose, otp } = params;

    const otpKey = otpRedisKeys.getStorageKey({ phoneNumber, purpose });
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp) {
      throw new Error("OTP expired or not found.");
    }

    if (storedOtp !== otp.toString()) {
      throw new Error("Invalid OTP.");
    }

    // Invalidate OTP after success
    await redis.del(otpKey);

    return { message: "OTP validated successfully" };
  }

  private async sendOtp(phoneNumber: string, otp: number) {
    // TODO: Add sms provider
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  }
}
