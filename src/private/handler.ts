import { CommandMiddleware } from "grammy";

import { ChatContext } from "./composer.js";

type CommandHandler = CommandMiddleware<ChatContext>;

export const startCmd: CommandHandler = async (ctx) => {
  await ctx.reply(ctx.text.startMsg());
};
