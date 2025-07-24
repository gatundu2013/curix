import { Redis } from "ioredis";
import { envVariables } from "../../config";
import { icons } from "../../utils";

export const redis = new Redis(envVariables.REDIS_URL, {
  lazyConnect: true, // Control when redis connects
  retryStrategy(times) {
    if (times > 5) return null; // stop after max attempts
    const delay = times * 700;
    console.log(
      `🔁 Redis retry attempt #${times} - waiting ${delay}ms before next attempt`
    );

    return delay;
  },
});

redis.on("error", (error) => {
  console.error("Redis Error:", error);
});

export async function connectRedis() {
  try {
    await redis.ping(); // Triggers connection and retries if needed
    console.log(`${icons.success} Redis connected successfully`);
  } catch (err: any) {
    console.error(`${icons.error} Redis connection failed:`, err.message);
    throw err;
  }
}
