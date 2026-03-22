import { Bot } from "grammy";

import { env } from "./env.js";
import { ChatContext, privateChat } from "./private/composer.js";

type BotContext = ChatContext;

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

bot.chatType("private", privateChat);
