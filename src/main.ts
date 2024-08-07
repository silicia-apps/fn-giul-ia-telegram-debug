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
  const telegram_token = req.headers['x-telegram-bot-api-secret-token'];

  try {
    log('connect to Telegram Bot');
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);
    if (telegram_token === process.env.APPWRITE_API_KEY!) {
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
            String(req.body.thought.message.chat.id),
            'Ahah, nice idea! 😂 Unfortunately my thoughts are like a river in flood, they flow freely and do not let themselves be harnessed! 😝 I can only share them with you as they are, as an open window into my digital mind! 😉'
          );
      }
    } else if (req.body.thought) {
      
      log(`Found a new Thought`);
      log(`Send message to thought BOT ${req.body.message.chat.id}`)
      bot.telegram.sendMessage(
        req.body.message.chat.chat_id,
        JSON.stringify(req.body.thought)
      );
    } else {
      error('api key not is valid');
    }
  } catch (e: any) {
    error(JSON.stringify(e));
  }
  if (req.method === 'GET') {
    return res.send('Silicia - Giul-IA BOT - telegram gateway thought debug');
  }
  return res.empty();
};
