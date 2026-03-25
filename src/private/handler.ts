import { ConversationBuilder } from "@grammyjs/conversations";
import {
  CommandMiddleware,
  Context,
  HearsMiddleware,
  Keyboard,
  Middleware
} from "grammy";

import { env } from "../env.js";
import { ChatContext } from "./composer.js";

type HearsHandler = HearsMiddleware<ChatContext>;
type CommandHandler = CommandMiddleware<ChatContext>;
type PostHandler = Middleware<ChatContext>;
type ConvoBuilder = ConversationBuilder<ChatContext, Context>;

export const langHears: HearsHandler = async (ctx) => {
  await ctx.conversation.enter("langConvo");
};

export const startCmd: CommandHandler = async (ctx) => {
  const langLabel = ctx.text.langLabel();
  const langKeyboard = new Keyboard().text(langLabel).resized().oneTime();

  await ctx.reply(ctx.text.startMsg(), {
    reply_markup: langKeyboard,
    parse_mode: "HTML"
  });
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
  session.messages = [ctx.message!.message_id];

  const readyKeyboard = new Keyboard()
    .text(ctx.text.readyButton())
    .resized()
    .oneTime();

  await ctx.reply(ctx.text.msgReceived(), { reply_markup: readyKeyboard });
  await ctx.conversation.enter("postConvo");
};

export const postConvo: ConvoBuilder = async (convo, ctx) => {
  const readyLabel = await convo.external((ctx) => ctx.text.readyButton());
  const receivedText = await convo.external((ctx) => ctx.text.msgReceived());
  const readyKeyboard = new Keyboard().text(readyLabel).resized().oneTime();

  while (true) {
    const msgCtx = await convo.waitFor("message");

    if (msgCtx.message.text === readyLabel) break;

    await convo.external(async (ctx) => {
      (await ctx.session).messages.push(msgCtx.message.message_id);
    });

    await msgCtx.reply(receivedText, { reply_markup: readyKeyboard });
  }

  const messages = await convo.external(
    async (ctx) => (await ctx.session).messages
  );

  const summaryText = await convo.external((ctx) =>
    ctx.text.summary(messages.length)
  );
  const sendLabel = await convo.external((ctx) => ctx.text.sendButton());
  const cancelLabel = await convo.external((ctx) => ctx.text.cancelButton());
  const actionKeyboard = new Keyboard()
    .text(sendLabel)
    .text(cancelLabel)
    .resized()
    .oneTime();

  await ctx.reply(summaryText, { reply_markup: actionKeyboard });
  await ctx.api.copyMessages(ctx.chat!.id, ctx.chat!.id, messages);

  const action = await convo.form.select([sendLabel, cancelLabel], {
    otherwise: async (ctx) => {
      const chooseActionText = await convo.external((ctx) =>
        ctx.text.chooseAction()
      );
      await ctx.reply(chooseActionText, {
        reply_markup: actionKeyboard
      });
    }
  });

  if (action === sendLabel) {
    await ctx.api.copyMessages(env.GROUP_ID, ctx.chat!.id, messages);
    const sentText = await convo.external((ctx) => ctx.text.sent());
    await ctx.reply(sentText, { reply_markup: { remove_keyboard: true } });
  } else {
    const canceledText = await convo.external((ctx) => ctx.text.canceled());
    await ctx.reply(canceledText, { reply_markup: { remove_keyboard: true } });
  }

  await convo.external(async (ctx) => {
    (await ctx.session).messages = [];
  });
};
