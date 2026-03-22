import { Bot, Context, session, SessionFlavor } from "grammy";

import { redisStorage } from "./db.js";
import { env } from "./env.js";

interface SessionData {
  __language_code: string;
}

type BotContext = Context & SessionFlavor<SessionData>;

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

bot.use(session({ initial: () => ({}), storage: redisStorage }));

bot.command("start", (ctx) => ctx.reply("Welcome!"));
