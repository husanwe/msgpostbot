import { I18nFlavor } from "@grammyjs/i18n";
import { Composer, Context, lazySession, SessionFlavor } from "grammy";

import { redisStorage } from "../db.js";
import { i18n } from "./i18n.js";
import { createMsg, Msg } from "./message.js";

interface SessionData {
  __language_code?: string;
}

export type ChatContext = Context &
  SessionFlavor<SessionData> &
  I18nFlavor & { text: Msg };

export const privateChat = new Composer<ChatContext>();

privateChat.use(
  lazySession<SessionData, ChatContext>({
    initial: () => ({}),
    storage: redisStorage()
  })
);
privateChat.use(i18n);
privateChat.use((ctx, next) => {
  ctx.text = createMsg(ctx.t.bind(ctx));
  return next();
});

privateChat.command("start", async (ctx) => {
  await ctx.reply(ctx.text.start());
});
