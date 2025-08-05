export enum OTP_PURPOSE {
  REGISTER = "register",
  RESET_PASSWORD = "resetPassword",
}

export type RegisterPayload = {
  username: string;
  phoneNumber: string;
  password: string;
  otp: string;
  acceptedTerms: boolean;
};

export type LoginPayload = {
  phoneNumber: string;
  password: string;
};

export type ResetPasswordPayload = {
  phoneNumber: string;
  newPassword: string;
  otp: string;
};

export type RequestOtpPayload = {
  phoneNumber: string;
  purpose: OTP_PURPOSE;
};
