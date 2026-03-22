import { I18n } from "@grammyjs/i18n";

import { ChatContext } from "./composer.js";

export const i18n = new I18n<ChatContext>({
  defaultLocale: "en",
  useSession: true,
  directory: "locales"
});
