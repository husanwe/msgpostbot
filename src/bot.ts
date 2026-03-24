import { Bot } from "grammy";

import { env } from "./env.js";
import { ChatContext, privateChat } from "./private/composer.js";

type BotContext = ChatContext;

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

bot.chatType("private", privateChat);

await bot.api.setMyCommands([{ command: "start", description: "start bot" }], {
  scope: { type: "all_private_chats" }
});
