import express from "express";
import { connectDb } from "./db/connection/postgres-connection";
import { connectRedis } from "./db/connection/redis-connection";
import { envVariables } from "./config/env-config";

const app = express();

export async function initApp() {
  try {
    await connectDb();
    await connectRedis();

    app.listen(envVariables.PORT, () => {
      console.log(`The server is running on port ${envVariables.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start App", err);
    process.exit(1);
  }
}
