import crypto from "crypto";
import { OtpRedisService } from "../redis/otp.redis";
import { OtpPayload } from "../../types";

// Initialize Redis service instance for OTP operations
const otpRedisService = new OtpRedisService();

/**
 * Handles business logic for generating and validating OTPs.
 * Manages rate limiting, OTP generation, SMS sending, and validation.
 */
export class OtpService {
  // Maximum number of OTP requests allowed per phone number within the rate limit window
  private MAX_OTP_REQUESTS = 3;

  /**
   * Generates and sends a new OTP to the specified phone number
   * Enforces rate limiting to prevent abuse
   *
   * @param phoneNumber - The phone number to send the OTP to
   * @param purpose - The context/reason for the OTP (e.g., registration, login)
   * @returns The generated OTP string
   * @throws Error if rate limit is exceeded
   */
  async generateOtp({
    phoneNumber,
    purpose,
  }: Pick<OtpPayload, "phoneNumber" | "purpose">): Promise<string> {
    // Check how many OTP requests have been made recently for this phone number
    const requestCount = await otpRedisService.countRecentOtpRequests({
      phoneNumber,
    });

    // Enforce rate limiting to prevent spam and abuse
    if (requestCount >= this.MAX_OTP_REQUESTS) {
      throw new Error("Too many OTP requests. Try again later.");
    }

    // Generate a cryptographically secure 4-digit OTP
    // Range: 1001-9998 (excludes 1000 and 9999 for consistency)
    const otp = crypto.randomInt(1001, 9999).toString();

    // Store the OTP in Redis with automatic expiration
    await otpRedisService.storeOtp({ phoneNumber, purpose, otp });

    // Send the OTP to the user via SMS
    await this.sendOtpViaSms(phoneNumber, otp);

    return otp;
  }

  /**
   * Validates a user-provided OTP against the stored value
   * Performs basic input validation before checking against stored OTP
   *
   * @param phoneNumber - The phone number associated with the OTP
   * @param purpose - The context/reason for the OTP validation
   * @param otp - The OTP code provided by the user
   * @returns true if OTP is valid, false otherwise
   */
  async validateOtp({
    phoneNumber,
    purpose,
    otp,
  }: OtpPayload): Promise<boolean> {
    if (!otp || otp.length !== 4) {
      return false;
    }

    const storedOtp = await otpRedisService.getOtp({ phoneNumber, purpose });

    // Compare user-provided OTP with stored value
    if (!storedOtp || storedOtp !== otp) {
      return false;
    }

    // OTP is valid
    return true;
  }

  /**
   * Sends an OTP to the specified phone number via SMS
   * @param phoneNumber - The phone number to send the SMS to
   * @param otp - The OTP code to include in the SMS message
   * @private
   */
  private async sendOtpViaSms(phoneNumber: string, otp: string): Promise<void> {
    // TODO: Integrate with SMS provider
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  }
}
