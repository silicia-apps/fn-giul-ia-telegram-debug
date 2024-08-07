import { Client, Databases, Query, Models } from 'node-appwrite';
import { Telegraf } from 'telegraf';

// for local development
import * as process from './env.js';

/*function log(text: string) {
  console.log(text);
}
function error(text: string) {
  console.error(text);
}*/

export interface HistoryItem {
  role: 'model' | 'user';
  parts: {
    text: string;
  }[];
}

export interface Message extends Models.Document {
  $id: string;
  message: string;
  thought: Thought;
  bot: boolean;
  chat: Chat;
}

export interface Thought extends Models.Document {
  thought: string;
  message: Message;
}

export interface Chat {
  $id: string;
  chat_id: string;
  channel: 'telegram' | 'alexa';
  messages: Message[];
}

export interface Module {
  name: string;
  description: string;
  queue: string[];
  actions: string[];
  events: string[];
}
export interface SlotLtm {
  key: string;
  value: string[];
}

export interface Es {
  $id: string;
  fear?: number;
  happiness?: number;
  sadness?: number;
  anger?: number;
  surprise?: number;
  disgust?: number;
  anxiety?: number;
  excitement?: number;
  frustration?: number;
  satisfaction?: number;
  curiosity?: number;
  boredom?: number;
  nostalgia?: number;
  hope?: number;
  pride?: number;
  shame?: number;
  concentration?: number;
  confusion?: number;
  calm?: number;
  stress?: number;
  creativity?: number;
  empathy?: number;
  logic?: number;
  humor?: number;
  learning?: number;
  connection?: number;
  autonomy?: number;
}

export interface Profile extends Models.Document {
  name: string;
  chats: Chat[];
  es: Es;
  queue: string[];
  ltm: SlotLtm[];
  modules: Module[];
}

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
      const body = JSON.parse(req.body);
      log(`Found a new Thought`);
      log(`Get Message index`);

      log(JSON.stringify(req));
      bot.telegram.sendMessage(
        body.tought.message.chat.chat_id,
        JSON.stringify(body.tought)
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
