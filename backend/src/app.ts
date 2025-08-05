import express from "express";
import { connectDb } from "./db/connection/postgres-connection";
import { connectRedis } from "./db/connection/redis-connection";
import { envVariables } from "./config/env-config";
import { OtpService } from "./services/otp/otp-services";
import { OTP_PURPOSE } from "./types/shared/auth-types";

const app = express();

const x = new OtpService();

export async function initApp() {
  try {
    await connectDb();
    await connectRedis();

    await x.generateOtp({
      phoneNumber: "0760606060",
      purpose: OTP_PURPOSE.REGISTER,
    });

    app.listen(envVariables.PORT, () => {
      console.log(`The server is running on port ${envVariables.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start App", err);
    process.exit(1);
  }
}
