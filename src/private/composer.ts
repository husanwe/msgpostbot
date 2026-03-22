import { Composer, Context, session, SessionFlavor } from "grammy";

import { redisStorage } from "../db.js";

interface SessionData {
  __language_code: string;
}

export type ChatContext = Context & SessionFlavor<SessionData>;

export const privateChat = new Composer<ChatContext>();

privateChat.use(session({ initial: () => ({}), storage: redisStorage }));

privateChat.command("start", (ctx) => ctx.reply("Welcome!"));
