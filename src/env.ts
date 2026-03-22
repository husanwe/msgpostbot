import zod from "zod";

const envSchema = zod.object({
  BOT_TOKEN: zod.string()
});

export const env = envSchema.parse(process.env);
