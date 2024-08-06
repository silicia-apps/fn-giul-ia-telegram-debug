import { Client, Databases, Query, ID } from 'node-appwrite';
import { Telegraf } from 'telegraf';

import * as process from './env.js';

function log(text: string) {
  console.log(text);
}
function error(text: string) {
  console.error(text);
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
    if (telegram_token === process.env.APPWRITE_API_KEY!) {
      log('connect to Telegram Bot');
      const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);
      log('connect to appwrite api');
      const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_API_KEY!);
      let datastore = new Databases(client);
      let chat = await datastore.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_TABLE_CHATS_ID!,
        [
          Query.equal('channel', 'telegram'),
          Query.equal('username', String(req.body.message.from.username)),
          Query.limit(1),
        ]
      );

      switch (req.body.message.text) {
        case '/start':
          log('present the bot');
          bot.telegram.sendMessage(
            String(req.body.message.chat.id),
            "Welcome to the chat where my thoughts come to life! Get ready to peek into my mind and find out what's going on in my head! 🎉 It's going to be an exciting journey! 😉"
          );
          log(`save chat id in profile`);
          datastore.updateDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_TABLE_PROFILES_ID!,
            chat.documents[0].$id,
            { chat_id_thought: req.body.message.chat.id }
          );
          bot.telegram.sendMessage(
            String(req.body.message.chat.id),
            "Welcome to the chat where my thoughts come to life! Get ready to peek into my mind and find out what's going on in my head! 🎉 It's going to be an exciting journey! 😉"
          );
          break;
        default:
          if (chat.total > 0) {
            bot.telegram.sendMessage(
              String(req.body.message.chat.id),
              'Ahah, nice idea! 😂 Unfortunately my thoughts are like a river in flood, they flow freely and do not let themselves be harnessed! 😝 I can only share them with you as they are, as an open window into my digital mind! 😉'
            );
          } else {
            error('No User Found');
            bot.telegram.sendMessage(
              String(req.body.message.chat.id),
              'to access you must first log in to the bot /giul-ia-bot'
            );
          }
        }

    } else if (req.body.message) {
        log('connect to Telegram Bot');
        log(`sent thought to telegram channel`);
        const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
        console.log(String(req.body.chat.chat_id_thought));
        console.log(req.body.message);
        bot.telegram.sendMessage(
          String(req.body.chat.chat_id_thought),
          req.body.message
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
