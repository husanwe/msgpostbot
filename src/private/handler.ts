import { ConversationBuilder } from "@grammyjs/conversations";
import {
  CommandMiddleware,
  HearsMiddleware,
  Keyboard,
  Middleware
} from "grammy";

import { BaseChatContext, ChatContext } from "./composer.js";

type HearsHandler = HearsMiddleware<ChatContext>;
type CommandHandler = CommandMiddleware<ChatContext>;
type PostHandler = Middleware<ChatContext>;
type ConvoBuilder = ConversationBuilder<ChatContext, BaseChatContext>;

export const langHears: HearsHandler = async (ctx, next) => {
  const { selectingLang } = await ctx.session;

  if (!selectingLang) {
    return next();
  }

  await ctx.conversation.enter("langConvo");
};

export const startCmd: CommandHandler = async (ctx) => {
  const session = await ctx.session;
  session.selectingLang = true;

  const langLabel = ctx.text.langLabel();
  const langKeyboard = new Keyboard().text(langLabel).resized().oneTime();

  await ctx.reply(ctx.text.startMsg(), { reply_markup: langKeyboard });
};

export const langConvo: ConvoBuilder = async (convo, ctx) => {
  const uzLabel = await convo.external((ctx) => ctx.text.langUzLabel());
  const ruLabel = await convo.external((ctx) => ctx.text.langRuLabel());
  const enLabel = await convo.external((ctx) => ctx.text.langEnLabel());
  const langSelect = await convo.external((ctx) => ctx.text.langSelect());
  const langButtons = new Keyboard()
    .text(ruLabel)
    .text(enLabel)
    .row()
    .text(uzLabel)
    .resized()
    .oneTime();

  await ctx.reply(langSelect, { reply_markup: langButtons });

  const lang = await convo.form.select([uzLabel, ruLabel, enLabel], {
    otherwise: (ctx) => ctx.reply(langSelect, { reply_markup: langButtons })
  });

  switch (lang) {
    case uzLabel:
      await convo.external((ctx) => ctx.i18n.setLocale("uz"));
      break;
    case ruLabel:
      await convo.external((ctx) => ctx.i18n.setLocale("ru"));
      break;
    case enLabel:
      await convo.external((ctx) => ctx.i18n.setLocale("en"));
      break;
  }

  const langSuccess = await convo.external((ctx) => ctx.text.langSuccess());

  return await ctx.reply(langSuccess, {
    reply_markup: { remove_keyboard: true }
  });
};

export const postMsg: PostHandler = async (ctx) => {
  const session = await ctx.session;
  session.selectingLang = false;

  await ctx.reply(String(ctx.update.update_id), {
    reply_markup: { remove_keyboard: true }
  });
};
