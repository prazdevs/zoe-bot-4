import { Message, Client } from 'discord.js';
import { Connection } from 'typeorm';
import { addRule, removeRule, getRules } from './commands';

export const onMessage = async (
  message: Message,
  connection: Connection,
  client: Client
): Promise<void> => {
  // client must have user
  if (!client.user) return;

  // ignore other bots
  if (message.author.bot) return;

  // ignore DMs
  if (!message.guild) return;

  // only admins can manage rules
  if (!message.member?.hasPermission('ADMINISTRATOR')) return;

  // parse arguments
  const content = message.content.slice(2);
  const [command, ...args] = content.split(' ').map((i) => i.trim());

  if (command === 'add') {
    const [reddit, publicChanTag, modChanTag, delay] = args;

    // parse ids from mentions
    const [publicChan, modChan] = [publicChanTag, modChanTag].map((tag) =>
      tag.replace(/[<>#]/g, '')
    );

    // compulsory arguments
    if (!reddit || !publicChan) {
      await message.channel.send('Invalid command, missing arguments.');
      return;
    }

    // public channel must be valid text channel
    if (!channelExists(message, publicChan)) {
      message.channel.send(`Channel ${publicChan} is invalid.`);
      return;
    }

    // mod channel must be valid text channel
    if (modChan && !channelExists(message, modChan)) {
      message.channel.send(`Channel ${modChan} is invalid.`);
      return;
    }

    // must have rights for public channel
    if (
      !message.guild.channels.cache
        .get(publicChan)
        ?.permissionsFor(client.user)
        ?.has([
          'ADD_REACTIONS',
          'EMBED_LINKS',
          'MANAGE_MESSAGES',
          'READ_MESSAGE_HISTORY',
          'SEND_MESSAGES',
          'VIEW_CHANNEL',
        ])
    ) {
      await message.channel.send(
        `Insufficient permissions for channel ${publicChan}.`
      );
      return;
    }

    // must have rights for mod channel
    if (
      modChan &&
      !message.guild.channels.cache
        .get(modChan)
        ?.permissionsFor(client.user)
        ?.has([
          'ADD_REACTIONS',
          'EMBED_LINKS',
          'MANAGE_MESSAGES',
          'READ_MESSAGE_HISTORY',
          'SEND_MESSAGES',
          'VIEW_CHANNEL',
        ])
    ) {
      await message.channel.send(
        `Insufficient permissions for channel ${modChan}.`
      );
      return;
    }

    let automodDelay;
    if (delay) {
      automodDelay = parseInt(delay);
      if (isNaN(automodDelay) || automodDelay <= 0) {
        automodDelay = null;
        message.channel.send('Invalid automod delay.');
      }
    } else {
      automodDelay = null;
    }

    await addRule(
      connection,
      message,
      message.guild.id,
      reddit,
      publicChan,
      modChan,
      automodDelay
    );
  } else if (command === 'remove') {
    const [reddit] = args;
    if (!reddit) return;
    await removeRule(connection, message, message.guild.id, reddit);
  } else if (command === 'get') {
    await getRules(connection, message, message.guild.id);
  }
};

const channelExists = (message: Message, channelId: string): boolean => {
  const channel = message.guild?.channels.cache.get(channelId);
  return channel?.type === 'text';
};
