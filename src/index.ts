import 'reflect-metadata';

import { Client } from 'discord.js';
import { createConnection } from 'typeorm';
import { Rule } from './entities/Rule';
import { onMessage } from './handlers';
import { startRoutine } from './routine';

async function doStuff() {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    entities: [Rule],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
  });

  const client = new Client({
    partials: ['REACTION', 'MESSAGE', 'CHANNEL'],
  });

  client.on('message', async (message) => {
    await onMessage(message, connection);
  });

  client.on('ready', async () => {
    await startRoutine(connection, client, 300);
  });

  await client.login(process.env.DISCORD_TOKEN);
}

doStuff();
