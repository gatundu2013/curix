import jwt from "jsonwebtoken";
import { envVariables } from "../config";
import { JwtPayloadI } from "../types/auth.types";

export async function generateAuthTokens(jwtPayload: JwtPayloadI) {
  return {
    accessToken: jwt.sign(jwtPayload, envVariables.JWT_ACCESS_SECRET),
    refreshToken: jwt.sign(jwtPayload, envVariables.JWT_REFRESH_SECRET),
  };
}
