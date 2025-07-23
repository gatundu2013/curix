import { envVariables } from "./config"; // load enviroment
import express from "express";
import { icons } from "./utils/icons";

const app = express();

async function startServer() {
  try {
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
