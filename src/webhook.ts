import express from "express";
import { webhookCallback } from "grammy";

import { bot } from "./bot.js";
import { env } from "./env.js";

const botInfo = await bot.api.getMe();
const app = express();

app.use(express.json());
app.use(webhookCallback(bot, "express"));
await bot.api.setWebhook(`https://${env.DOMAIN_NAME}/webhook`);
app.listen(3000, () => {
  console.log(
    `https://t.me/${botInfo.username} started on webhook mode at https://${env.DOMAIN_NAME}/webhook`
  );
});
