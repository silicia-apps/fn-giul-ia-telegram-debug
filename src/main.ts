import { Telegraf } from 'telegraf';

/* for local development
import * as process from './env.js';

function log(text: string) {
  console.log(text);
}
function error(text: string) {
  console.error(text);
}*/

type Context = {
  req: any;
  res: any;
  log: (msg: string) => void;
  error: (msg: string) => void;
};

export default async ({ req, res, log, error }: Context) => {
  function debug(text: string) {
    if (process.env.DEBUG!.toLowerCase() === 'true') {
      error(`debug: ${text}`);
    }
  }
  debug(`request: ${JSON.stringify(req.body)}`);
  const telegram_token = req.headers['x-telegram-bot-api-secret-token'];
  try {
    log('connect to Telegram Bot');
    if (telegram_token === process.env.APPWRITE_API_KEY!) {
      const bot = new Telegraf(process.env.TELEGRAM_TOKEN_THOUGHTS!);
      switch (req.body.message.text) {
        case '/start':
          log('present the bot');
          bot.telegram.sendMessage(
            String(req.body.message.chat.id),
            "Welcome to the chat where my thoughts come to life! Get ready to peek into my mind and find out what's going on in my head! 🎉 It's going to be an exciting journey! 😉"
          );
          break;
        default:
          bot.telegram.sendMessage(
            String(req.body.message.chat.id),
            'Ahah, nice idea! 😂 Unfortunately my thoughts are like a river in flood, they flow freely and do not let themselves be harnessed! 😝 I can only share them with you as they are, as an open window into my digital mind! 😉'
          );
      }
    } else {
      if (req.body.action) {
        log(`Found a new Action`);
        log(
          `Send message to Action BOT at chatid ${req.body.thought.chat.chatid}`
        );
        const bot = new Telegraf(process.env.TELEGRAM_TOKEN_ACTIONS!);
        log(`sent action to telegram channel`);
        bot.telegram.sendMessage(
          String(req.body.thought.chat.chatid),
          req.body.action
        );
      } else if (req.body.thought) {
        log(`Found a new Thought`);
        log(
          `Send message to thought BOT at chatid ${req.body.message.chat.chatid}`
        );
        const bot = new Telegraf(process.env.TELEGRAM_TOKEN_THOUGHTS!);
        bot.telegram.sendMessage(
          String(req.body.message.chat.chatid),
          req.body.thought
        );
      } else {
        error('api key not is valid');
      }
    }
    if (req.method === 'GET') {
      return res.send('Silicia - Giul-IA BOT - telegram gateway thought debug');
    }
    return res.empty();
  } catch (e: any) {
    error(String(e));
  }
};
