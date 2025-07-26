import { envVariables } from "./config"; // load enviroment
import express from "express";
import { icons } from "./utils/icons.utils";
import { connectDb, connectRedis } from "./db/connection";
import { v1Router } from "./routes/v1";

const app = express();

app.use(express.json());
app.use("/api/v1", v1Router);

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
