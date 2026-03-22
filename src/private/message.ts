import { TranslateFunction } from "@grammyjs/i18n";

export const createMsg = (t: TranslateFunction) => ({
  startMsg: () => t("start-cmd")
});

export type Msg = ReturnType<typeof createMsg>;
