import { Message } from 'discord.js';
import { Connection } from 'typeorm';
import { addRule, removeRule, getRules } from './commands';

export const onMessage = async (
  message: Message,
  connection: Connection
): Promise<void> => {
  // ignore other bots
  if (message.author.bot) return;

  // ignore DMs
  if (!message.guild) return;

  // only admins can manage rules
  if (!message.member?.hasPermission('ADMINISTRATOR')) return;

  const content = message.content.slice(2);
  const [command, ...args] = content.split(' ');

  if (command === 'add') {
    const [reddit, publicChan, modChan] = args;
    if (!reddit || !publicChan) return;
    await addRule(
      connection,
      message,
      message.guild.id,
      reddit,
      publicChan,
      modChan
    );
  } else if (command === 'remove') {
    const [reddit] = args;
    if (!reddit) return;
    await removeRule(connection, message, message.guild.id, reddit);
  } else if (command === 'get') {
    await getRules(connection, message, message.guild.id);
  }
};
