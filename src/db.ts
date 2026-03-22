import { RedisAdapter } from "@grammyjs/storage-redis";
import { Redis } from "ioredis";

import { env } from "./env.js";

const redis = new Redis(env.REDIS_URL);

export const redisStorage = <T>() => {
  return new RedisAdapter<T>({ instance: redis });
};
