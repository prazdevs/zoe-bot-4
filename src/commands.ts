import { Rule } from './entities/Rule';
import { Message } from 'discord.js';
import { getIcon } from './fetchReddit';
import { Connection } from 'typeorm';

export const addRule = async (
  connection: Connection,
  message: Message,
  guildId: string,
  reddit: string,
  publicChan: string,
  modChan: string,
  automodDelay: number | null
): Promise<void> => {
  const rule = new Rule();
  rule.guild = guildId;
  rule.reddit = reddit;
  rule.publicChan = publicChan;
  rule.modChan = modChan;
  if (automodDelay) rule.automodDelay = automodDelay;

  rule.icon = await getIcon(reddit);

  try {
    await connection.getRepository(Rule).save(rule);
    const reply = buildRulePrint(
      message,
      reddit,
      publicChan,
      modChan,
      automodDelay
    );
    await message.channel.send(reply);
  } catch (error) {
    if (error.code === '23505') {
      throw new Error(`There is already a rule for \`${reddit}\`.`);
    }
    console.error(error);
    throw new Error(`Failed to add a rule due to internal error.`);
  }
};

export const removeRule = async (
  connection: Connection,
  message: Message,
  guildId: string,
  reddit: string
): Promise<void> => {
  try {
    const result = await connection
      .getRepository(Rule)
      .delete({ guild: guildId, reddit });
    const response = result.affected
      ? `Deleted rule for \`${reddit}\``
      : `No rule for \`${reddit}\` found.`;
    await message.channel.send(response);
  } catch (error) {
    await message.channel.send(
      `Failed to remove rule for \`${reddit}\` because of an internal error.`
    );
    console.error(error);
  }
};

export const getRules = async (
  connection: Connection,
  message: Message,
  guildId: string
): Promise<void> => {
  try {
    const rules = (await connection.getRepository(Rule).find()).filter(
      (r) => r.guild === guildId
    );
    if (!rules.length) {
      message.channel.send('No rule found.');
      return;
    }

    rules.forEach(async (rule) => {
      const reply = buildRulePrint(
        message,
        rule.reddit,
        rule.publicChan,
        rule.modChan,
        rule.automodDelay
      );
      await message.channel.send(reply);
    });
  } catch (error) {
    await message.channel.send(`Could not fetch rules due to internal error.`);
    console.error(error);
  }
};

const buildRulePrint = (
  message: Message,
  reddit: string,
  publicChanId: string,
  modChanId: string | undefined,
  automodDelay: number | null | undefined
) => {
  const publicChan = message.guild?.channels.cache.get(publicChanId);
  let reply = `Added rule for reddit \`${reddit}\` posted in '${publicChan}'`;
  if (modChanId) {
    const modChan = message.guild?.channels.cache.get(modChanId);
    reply += ` modded in ${modChan}.`;
  }
  if (automodDelay) {
    reply += ` Posts will be automodded after ${automodDelay} seconds.`;
  }
};
