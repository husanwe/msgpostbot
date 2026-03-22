import { Bot } from "grammy";

export const bot = new Bot(process.env.BOT_TOKEN || "");

bot.command("start", (ctx) => ctx.reply("Welcome!"));
