export enum OTP_PURPOSE {
  REGISTER = "register",
  RESET_PASSWORD = "resetPassword",
}

export interface OtpPayload {
  phoneNumber: string;
  purpose: OTP_PURPOSE;
  otp: string;
}
