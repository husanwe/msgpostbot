import { TranslateFunction } from "@grammyjs/i18n";

export const createMsg = (t: TranslateFunction) => ({
  start: () => t("start")
});

export type Msg = ReturnType<typeof createMsg>;
