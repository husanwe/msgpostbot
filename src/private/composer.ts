import {
  ConversationFlavor,
  conversations,
  createConversation
} from "@grammyjs/conversations";
import { hears, I18nFlavor } from "@grammyjs/i18n";
import { Composer, Context, lazySession, LazySessionFlavor } from "grammy";

import { redisStorage } from "../db.js";
import {
  langConvo,
  langHears,
  postConvo,
  postMsg,
  startCmd
} from "./handler.js";
import { i18n } from "./i18n.js";
import { createMsg, Msg } from "./message.js";

interface SessionData {
  __language_code?: string;
  messages: number[];
}

export type BaseChatContext = Context &
  LazySessionFlavor<SessionData> &
  I18nFlavor & { text: Msg };

export type ChatContext = ConversationFlavor<BaseChatContext>;

export const privateChat = new Composer<ChatContext>();

privateChat.use(
  lazySession<SessionData, ChatContext>({
    initial: () => ({ messages: [] }),
    storage: redisStorage()
  })
);
privateChat.use(i18n);
privateChat.use((ctx, next) => {
  ctx.text = createMsg(ctx.t.bind(ctx));
  return next();
});
privateChat.use(conversations());
privateChat.use(createConversation(langConvo));
privateChat.use(createConversation(postConvo));

privateChat.filter(hears("lang-label"), langHears);
privateChat.command("start", startCmd);
privateChat.on("message", postMsg);
