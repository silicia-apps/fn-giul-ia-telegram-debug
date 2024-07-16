import { Client } from 'node-appwrite';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'

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

  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  switch (req.body.message.text) {
    case '/start': log('Start Telegram Bot');

      bot.telegram.sendMessage(req.body.message.chat.id, 'Benvenuto');
    break;
    default:
      bot.telegram.sendMessage(req.body.message.chat.id, req.body.message.text);
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
};
