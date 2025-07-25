import { envVariables } from "./config"; // load enviroment
import express, { Router } from "express";
import { icons } from "./utils/icons";
import { connectDb, connectRedis } from "./db/connection";
import { userRouter } from "./routes/v1/user";
import { adminRouter } from "./routes/v1/admin";

const app = express();
const router = Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);

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
