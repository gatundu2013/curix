import * as z from "zod";

// Username: 3–20 chars, a-z, A-Z, 0-9, _ or -, must include at least one letter or digit
// 😊 "user_123", "__abc__" | 😡 "__", "---", "us", "user@name"
export const usernameRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]{3,20}$/;

// Phone: must start with 07 or 01 followed by 8 digitsw
// 😊 "0722123456", "0112345678" | 😡 "+254...", "254...", "07123"
export const phoneNumberRegex = /^(07|01)\d{8}$/;

export const registerSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(phoneNumberRegex, "Invalid phone number format"),
  username: z.string().regex(usernameRegex, "Invalid username format"),
  password: z.string().min(4, "Password must be atleast 4 char"),
  acceptedTerms: z.literal(true, "Terms and conditions must be accepted"),
  otp: z.string(),
});

export type RegisterPayload = z.infer<typeof registerSchema>;
