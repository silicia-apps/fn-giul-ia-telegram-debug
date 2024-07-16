import { Client, Databases, Query, ID } from 'node-appwrite';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

//import * as process from './env.js';

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
  try {
    log(req.body.message);
    log('connect to Telegram Bot');
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);
    log('connect to appwrite api');
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);
    let datastore = new Databases(client);
    let chat = await datastore.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_TABLE_CHATS_ID!,
      [
        Query.equal('channel', 'telegram'),
        Query.equal('chat_id', String(req.body.message.chat.id)),
        Query.limit(1),
      ]
    );

    switch (req.body.message.text) {
      case '/start':
        log('Registrazione Bot');
        if (chat.total === 0) {
          log('User not present');
          const new_user = {
            emotional_state: { fear: 0 },
            memories: [
              { name: 'first_name_user', value: req.body.message.from.first_name },
              { name: 'last_name_user', value: req.body.message.from.last_name },
              { name: 'prefered_language_user', value: req.body.message.from.language_code },
              { name: 'username_user', value: req.body.message.from.username }
            ],
            name: req.body.message.from.username,
            chats: [
              {
                channel: 'telegram',
                chat_id: String(req.body.message.chat.id),
              },
            ],
          };
          log(`write new user`);
          log(JSON.stringify(new_user));
          await datastore.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_TABLE_IDENTITIES_ID!,
            ID.unique(),
            new_user
          );
          log(`user created`);
          bot.telegram.sendMessage(String(req.body.message.chat.id), 'Welcome to Giulia BOT');
        } else {
          bot.telegram.sendMessage(String(req.body.message.chat.id), 'Welcome Back to Giulia BOT');
          log(`user already in database`);
        }
        break;
      default:
        datastore.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          process.env.APPWRITE_TABLE_MESSAGES_ID!,
          ID.unique(),
          {
            chat: String(req.body.message.chat.id),
            date: new Date().toISOString(),
            message: req.body.message.text
          }
        )
        console.log(req.body);
    }

    if (req.method === 'GET') {
      return res.send('Silicia - Giulia BOT - telegram gateway');
    }
  } catch (e: any) {
    error(JSON.stringify(e));
  }
};
