import { redis } from "../../db/connection";
import { randomUUID } from "crypto";
import { OtpPayload } from "../../types";

const redisOtpKeys = {
  // Generates OTP rate limiting Key
  rateLimitKey({ phoneNumber }: Pick<OtpPayload, "phoneNumber">) {
    return `rate-limit:otp:${phoneNumber}`;
  },

  // Generates OTP storage key
  otpStorageKey({
    phoneNumber,
    purpose,
  }: Pick<OtpPayload, "phoneNumber" | "purpose">) {
    return `otp:${phoneNumber}:${purpose}`;
  },
};

/**
 * Handles all Redis operations related to OTPs.
 */
export class OtpRedisService {
  private OTP_EXPIRY_SECONDS = 300; // mins
  private RATE_LIMIT_WINDOW_MS = 300_000; // Rate limiting window - sec

  /**
   * Stores an OTP in Redis with expiration and updates rate limiting data
   * @param phoneNumber - The phone number the OTP is associated with
   * @param purpose - The purpose/context of the OTP (e.g., registration, login)
   * @param otp - The OTP code to store
   */
  async storeOtp({ phoneNumber, purpose, otp }: OtpPayload): Promise<void> {
    const rateLimitKey = redisOtpKeys.rateLimitKey({ phoneNumber });
    const otpKey = redisOtpKeys.otpStorageKey({ phoneNumber, purpose });

    // Check if rate limit key exists to avoid overwriting expiration
    const hasRateLimitKey = await redis.exists(rateLimitKey);

    // Set expiration for rate limit key if it doesn't exist
    // This ensures old rate limit data is eventually cleaned up
    if (!hasRateLimitKey) {
      await redis.expire(rateLimitKey, 1800); // Expire set after 30 min
    }

    // Add current timestamp to rate limiting sorted set
    await redis.zadd(rateLimitKey, Date.now(), randomUUID());

    // Store the OTP with automatic expiration
    await redis.set(otpKey, otp, "EX", this.OTP_EXPIRY_SECONDS);
  }

  /**
   * Retrieves a stored OTP from Redis
   * @param phoneNumber - The phone number associated with the OTP
   * @param purpose - The purpose/context of the OTP
   * @returns The OTP string if found, null if expired or not found
   */
  async getOtp({
    phoneNumber,
    purpose,
  }: Pick<OtpPayload, "phoneNumber" | "purpose">): Promise<string | null> {
    const key = redisOtpKeys.otpStorageKey({ phoneNumber, purpose });
    return redis.get(key);
  }

  /**
   * Counts the number of OTP requests made within the rate limit window
   * Automatically cleans up old timestamps
   * @param phoneNumber - The phone number to check rate limits for
   * @returns Number of OTP requests in the current rate limit window
   */
  async countRecentOtpRequests({
    phoneNumber,
  }: Pick<OtpPayload, "phoneNumber">): Promise<number> {
    const key = redisOtpKeys.rateLimitKey({ phoneNumber });

    // Calculate cutoff timestamp for rate limit window
    const cutoff = Date.now() - this.RATE_LIMIT_WINDOW_MS;

    // Remove timestamps older than the rate limit window
    // This ensures accurate counting
    await redis.zremrangebyscore(key, 0, cutoff);

    // Count remaining timestamps (recent requests within window)
    return redis.zcard(key);
  }

  /**
   * Deletes a stored OTP from Redis
   * @param phoneNumber - The phone number associated with the OTP
   * @param purpose - The purpose/context of the OTP
   * @returns The OTP string if found, null if expired or not found
   */
  async deleteOtp({
    phoneNumber,
    purpose,
  }: Pick<OtpPayload, "phoneNumber" | "purpose">): Promise<boolean> {
    const key = redisOtpKeys.otpStorageKey({ phoneNumber, purpose });
    const status = await redis.del(key);
    return status === 1;
  }
}
