import { OTP_PURPOSE } from "../../types/shared/auth-types";

export const otpRedisKeys = {
  getStorageKey: (params: { phoneNumber: string; purpose: OTP_PURPOSE }) => {
    const { phoneNumber, purpose } = params;
    return `otp:${purpose}:${phoneNumber}`;
  },

  getRateLimitKey: (params: { phoneNumber: string }) => {
    const { phoneNumber } = params;
    return `otp:rateLimit:${phoneNumber}`;
  },
};
