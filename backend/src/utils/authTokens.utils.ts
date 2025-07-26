import jwt from "jsonwebtoken";
import { envVariables } from "../config";
import { JwtPayloadI } from "../types/auth.types";
import { Response } from "express";

const accessTokenMaxAgeMs = 1000 * 60 * 60; // 1 hour in milliseconds
const refreshTokenMaxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds
const accessTokenExpiry = "1h"; // for jwt.sign
const refreshTokenExpiry = "7d"; // for jwt.sign

export function generateAuthTokens(jwtPayload: JwtPayloadI) {
  return {
    accessToken: jwt.sign(jwtPayload, envVariables.JWT_ACCESS_SECRET, {
      expiresIn: accessTokenExpiry,
    }),
    refreshToken: jwt.sign(jwtPayload, envVariables.JWT_REFRESH_SECRET, {
      expiresIn: refreshTokenExpiry,
    }),
  };
}

export function setCookies(params: {
  res: Response;
  accessToken: string;
  refreshToken: string;
}) {
  const { res, accessToken, refreshToken } = params;

  res.cookie("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: accessTokenMaxAgeMs,
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: refreshTokenMaxAgeMs,
    sameSite: "lax",
  });
}
