import * as z from "zod";
import {
  otpRegex,
  phoneNumberRegex,
  usernameRegex,
} from "../constants/constants";
import {
  LoginPayload,
  OTP_PURPOSE,
  RegisterPayload,
  RequestOtpPayload,
  ResetPasswordPayload,
} from "../types/shared/auth-types";

export const registerSchema: z.ZodType<RegisterPayload> = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username cannot exceed 15 characters")
    .regex(
      usernameRegex,
      "Username can only contain letters, numbers, and single underscores. Cannot start or end with underscore, and cannot have consecutive underscores"
    )
    .trim(),

  phoneNumber: z
    .string()
    .regex(
      phoneNumberRegex,
      "Please enter a valid phone number (e.g., 0712345678 or 0112345678)"
    ),
  password: z
    .string()
    .min(4, "Password must be at least 8 characters long for security")
    .max(128, "Password cannot exceed 128 characters"),
  otp: z
    .string()
    .length(4, "OTP code must be exactly 4 digits")
    .regex(otpRegex, "OTP code must contain only numbers"),
  acceptedTerms: z.literal(
    true,
    "You must accept the terms and conditions to continue"
  ),
});

export const loginSchema: z.ZodType<LoginPayload> = z.object({
  phoneNumber: z
    .string()
    .regex(
      phoneNumberRegex,
      "Please enter a valid phone number (e.g., 0712345678 or 0112345678)"
    ),
  password: z.string(),
});

export const resetPasswordSchema: z.ZodType<ResetPasswordPayload> = z.object({
  phoneNumber: z
    .string()
    .regex(
      phoneNumberRegex,
      "Please enter a valid phone number (e.g., 0712345678 or 0112345678)"
    ),
  newPassword: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .max(128, "Password cannot exceed 128 characters"),
  otp: z
    .string()
    .min(1, "OTP code is required")
    .length(4, "OTP code must be exactly 4 digits")
    .regex(otpRegex, "OTP code must contain only numbers"),
});

export const requestOtpSchema: z.ZodType<RequestOtpPayload> = z.object({
  phoneNumber: z
    .string()
    .regex(
      phoneNumberRegex,
      "Please enter a valid phone number (e.g., 0712345678 or 0112345678)"
    ),
  purpose: z.enum(
    Object.values(OTP_PURPOSE),
    "Please select a valid purpose for the OTP (register or resetPassword)"
  ),
});
