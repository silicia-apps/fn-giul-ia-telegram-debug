import { Client } from 'node-appwrite';
import { Telegraf } from 'telegraf'

export default async ({ req, res, log, error }) => {

  const bot = new Telegraf('7378059092:AAGEZRT8290zit3tWR6ZjCCPn-AvKPqcDDU');

  switch (req.body.message.text) {
    case '/start': log('Inviato comando al bot');
      bot.telegram.sendMessage(req.body.message.chat.id, 'Benvenuto');
    break;
    default:
      bot.telegram.sendMessage(req.body.message.chat.id, req.body.message.text);
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
