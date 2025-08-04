import { Redis } from "ioredis";
import { envVariables } from "../../config/env-config";
import { ICONS } from "../../utils/icons-utils";

const redis = new Redis(envVariables.REDIS_URL, {
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 5) {
      return null;
    }

    const delay = Math.min(times * 1000, 5000);
    return delay;
  },
});

export async function connectRedis(maxRetries = 5) {
  let retries = 1;

  while (retries <= maxRetries) {
    try {
      await redis.connect();
      console.log(`${ICONS.success} Redis connected successfully`);
      return;
    } catch (err: any) {
      console.error(`${ICONS.error} Redis connection retry - ${retries}`);

      if (retries === maxRetries) {
        console.error(`${ICONS.error} Redis connection failed`, err.message);
        throw new Error("Redis connection failed");
      }

      const delay = 1000 * Math.pow(2, retries);
      await new Promise((res) => setTimeout(res, delay));

      retries += 1;
    }
  }
}
