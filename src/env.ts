import zod from "zod";

const envSchema = zod.object({
  BOT_TOKEN: zod.string(),
  REDIS_URL: zod.url().startsWith("redis://"),
  GROUP_ID: zod.coerce.number().int()
});

export const env = envSchema.parse(process.env);
