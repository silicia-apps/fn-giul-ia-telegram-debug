import { Client } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  switch (req.body.message.entities.type) {
    case 'bot_command': log('Inviato comando al bot');
    break;
    default:
      log('messaggio');
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
