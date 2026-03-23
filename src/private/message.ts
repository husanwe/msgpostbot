import { TranslateFunction } from "@grammyjs/i18n";

export const createMsg = (t: TranslateFunction) => ({
  startMsg: () => t("start-cmd"),
  langLabel: () => t("lang-label"),
  langSelect: () => t("lang-select"),
  langUzLabel: () => t("lang-uz-label"),
  langRuLabel: () => t("lang-ru-label"),
  langEnLabel: () => t("lang-en-label"),
  langSuccess: () => t("lang-success"),
  msgReceived: () => t("msg-received"),
  readyButton: () => t("ready-button"),
  sendButton: () => t("send-button"),
  cancelButton: () => t("cancel-button"),
  summary: (numOfMsgs: number) => t("summary", { numOfMsgs }),
  sent: () => t("sent"),
  canceled: () => t("canceled"),
  chooseAction: () => t("choose-action")
});

export type Msg = ReturnType<typeof createMsg>;
