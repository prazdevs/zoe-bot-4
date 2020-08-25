import { Message, User, Guild } from 'discord.js';
import { Connection } from 'typeorm';
import { addRule, removeRule, getRules } from './commands';

interface Arguments {
  command: string;
  reddit: string;
  publicChan: string;
  modChan: string;
  automodDelay: number | null;
}

export const onMessage = async (
  message: Message,
  connection: Connection,
  clientUser: User
): Promise<void> => {
  if (!message.guild) return;
  if (!canHandleMessage(message)) return;
  const args = parseArguments(message.content);
  try {
    await executeCommand(message, connection, clientUser, args);
  } catch (error) {
    await message.channel.send(error.message);
  }
};

const canHandleMessage = (message: Message): boolean => {
  return !!(
    !message.author.bot &&
    message.member?.hasPermission('ADMINISTRATOR') &&
    message.content.startsWith('z!')
  );
};

const parseArguments = (messageContent: string): Arguments => {
  const content = messageContent.slice(2);
  const args = content.split(' ').map((i) => i.trim());
  return {
    command: args[0],
    reddit: args[1],
    publicChan: args[2] && args[2]?.replace(/[<>#]/g, ''),
    modChan: args[3]?.replace(/[<>#]/g, ''),
    automodDelay: parseInt(args[4]) || null,
  };
};

const executeCommand = async (
  message: Message,
  connection: Connection,
  clientUser: User,
  args: Arguments
) => {
  if (!message.guild) return;
  if (args.command == 'add') {
    validateAddArguments(args, clientUser, message.guild);
    await addRule(
      connection,
      message,
      message.guild.id,
      args.reddit,
      args.publicChan,
      args.modChan,
      args.automodDelay
    );
  } else if (args.command == 'remove') {
    validateRemoveArguments(args);
    await removeRule(connection, message, message.guild.id, args.reddit);
  } else if (args.command == 'get') {
    await getRules(connection, message, message.guild.id);
  } else if (args.command == 'help') {
    await message.channel.send(`Help coming soon. Ask me instead for now.`);
  } else {
    throw new Error(`Unnown command. \`z!help\` for help.`);
  }
};

const hasPermissionsInChannel = (
  client: User,
  guild: Guild,
  channelId: string
): boolean => {
  return !!guild.channels.cache
    .get(channelId)
    ?.permissionsFor(client)
    ?.has([
      'ADD_REACTIONS',
      'EMBED_LINKS',
      'MANAGE_MESSAGES',
      'READ_MESSAGE_HISTORY',
      'SEND_MESSAGES',
      'VIEW_CHANNEL',
    ]);
};

const validateAddArguments = (
  args: Arguments,
  client: User,
  guild: Guild
): void => {
  if (!args.reddit)
    throw new Error('Invalid command: missing subreddit and public channel');
  if (!args.publicChan)
    throw new Error('Invalid command: missing public channel');
  if (!hasPermissionsInChannel(client, guild, args.publicChan))
    throw new Error('Insufficient permissions for public channel');
  if (args.modChan && !hasPermissionsInChannel(client, guild, args.modChan))
    throw new Error('Insufficient permissions for mod channel');
};

const validateRemoveArguments = (args: Arguments) => {
  if (!args.reddit) throw new Error('Invalid command: missing subreddit.');
};
