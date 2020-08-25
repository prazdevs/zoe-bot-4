import 'reflect-metadata';

import { Client } from 'discord.js';
import { createConnection } from 'typeorm';
import { Rule } from './entities/Rule';
import { onMessage } from './eventHandlers';
import { startRoutine } from './routine';

async function doStuff() {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Rule],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
  });

  const client = new Client({
    partials: ['REACTION', 'MESSAGE', 'CHANNEL'],
  });

  client.on('message', async (message) => {
    if (!client.user) return;
    await onMessage(message, connection, client.user);
  });

  client.on('ready', async () => {
    await startRoutine(connection, client, 300);
  });

  await client.login(process.env.DISCORD_TOKEN);
}

doStuff();
