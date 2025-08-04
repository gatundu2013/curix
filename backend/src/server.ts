import "./config/env-config";
import { connectDb } from "./db/connection/postgres-connection";
import { connectRedis } from "./db/connection/redis-connection";

connectDb();
connectRedis();
