import { envVariables } from "./config"; // load enviroment
import express from "express";
import { icons } from "./utils/icons";
import { connectDb } from "./db/connection";
import { connectRedis } from "./db/connection/redis";

const app = express();

async function startServer() {
  try {
    await connectDb();
    await connectRedis();

    app.listen(envVariables.PORT, () => {
      console.log(
        `${icons.success} Server is listening on port: ${envVariables.PORT}`
      );
    });
  } catch (err) {
    console.error(`${icons.error} Failed to start the server:`, err);
    process.exit(1);
  }
}

export { startServer };
