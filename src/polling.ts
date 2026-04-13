import { bot } from "./bot.js";

await bot.start({
  onStart: (botInfo) => {
    console.log(`https://t.me/${botInfo.username} started on polling mode`);
  }
});
