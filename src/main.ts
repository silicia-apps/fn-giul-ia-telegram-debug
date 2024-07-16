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
        Query.equal('chat_id', req.body.message.chat.id),
        Query.limit(1),
      ]
    );
    switch (req.body.message.text) {
      case '/start':
        log('Registrazione Bot');
        bot.telegram.sendMessage(req.body.message.chat.id, 'Benvenuto');      
        if (chat.total === 0) {
          log('User not present');
          const new_user = {
            memory: {},
            name: req.body.message.from.username,
            chats: { channel: 'telegram' , 'chat_id': req.body.message.chat.id}
          }
          log (`write new user ${new_user}`);
          await datastore.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_TABLE_IDENTITIES_ID,
            ID.unique(),
            new_user,
          );
          log (`user created`);
        } else {
          log (`user already in database`);
        }
        break;
      default:
        bot.telegram.sendMessage(
          req.body.message.chat.id,
          req.body.message.text
        );
        console.log(req.body);
    }

    // The `req` object contains the request data
    if (req.method === 'GET') {
      // Send a response with the res object helpers
      // `res.send()` dispatches a string back to the client
      return res.send('Hello, World!');
    }

    // `res.json()` is a handy helper for sending JSON
    return res.json({
      motto: 'Build like a team of hundreds_',
      learn: 'https://appwrite.io/docs',
      connect: 'https://appwrite.io/discord',
      getInspired: 'https://builtwith.appwrite.io',
    });
  } catch (e: any) {
    error(e);
  }
};
