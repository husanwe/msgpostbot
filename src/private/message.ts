import { TranslateFunction } from "@grammyjs/i18n";

export const createMsg = (t: TranslateFunction) => ({
  startMsg: () => t("start-cmd"),
  langLabel: () => t("lang-label"),
  langSelect: () => t("lang-select"),
  langUzLabel: () => t("lang-uz-label"),
  langRuLabel: () => t("lang-ru-label"),
  langEnLabel: () => t("lang-en-label"),
  langSuccess: () => t("lang-success")
});

export type Msg = ReturnType<typeof createMsg>;
