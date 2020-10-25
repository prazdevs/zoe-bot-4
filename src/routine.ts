import { Connection } from 'typeorm';
import fetch from 'node-fetch';
import {
  Client,
  TextChannel,
  MessageReaction,
  User,
  Collection,
  Message,
  MessageEmbed,
} from 'discord.js';
import { Rule } from './entities/Rule';
import {
  getLatestCollectionsSince,
  getSubmissionOk,
  SubmissionCollection,
} from './fetchReddit';
import { buildEmbed } from './buildEmbed';

export const startRoutine = async (
  connection: Connection,
  client: Client,
  delay: number
): Promise<void> => {
  const routine = async () => {
    const rules = await connection.getRepository(Rule).find();
    const subreddits = [...new Set(rules.map((r) => r.reddit))];
    const collections = await getLatestCollectionsSince(subreddits, delay);
    rules.forEach((rule) => {
      try {
        processRule(rule, client, collections);
      } catch (error) {
        console.error(`Failed to execute rule ${rule.reddit} ${rule.guild}`);
      }
    });
  };
  await routine();
  setInterval(routine, delay * 1000);
};

const processRule = (
  rule: Rule,
  client: Client,
  collections: SubmissionCollection[]
) => {
  const publicChannel = client.channels.cache.get(
    rule.publicChan
  ) as TextChannel;
  const modChannel = client.channels.cache.get(
    rule.modChan ?? ''
  ) as TextChannel;
  const submissions =
    collections.find((c) => c.subreddit === rule.reddit)?.submissions ?? [];
  submissions?.forEach(async (s) => {
    try {
      const embed = buildEmbed(s, rule.icon || '');
      if (modChannel) {
        const message = await modChannel.send(embed);
        await Promise.all([message.react('✅'), message.react('❌')]);
        const filter = (reaction: MessageReaction, user: User) =>
          ['✅', '❌'].includes(reaction.emoji.name) &&
          message.author.id !== user.id;
        const collector = message.createReactionCollector(filter, {
          max: 1,
          time: rule.automodDelay ? rule.automodDelay * 1000 : undefined,
        });
        collector.on('end', async (collected, reason) => {
          await handleCollectorEnd(
            collected,
            reason,
            client,
            message,
            publicChannel,
            rule.postUrl
          );
        });
      } else {
        await publicChannel.send(embed);
        if (rule.postUrl) postToUrl(embed, rule.postUrl); // do not await
      }
    } catch (error) {
      console.error('Failed to post a submission.', error);
    }
  });
};

const handleCollectorEnd = async (
  collected: Collection<string, MessageReaction>,
  reason: string,
  client: Client,
  message: Message,
  publicChannel: TextChannel,
  postUrl: string | undefined
) => {
  const reaction = collected.first();
  if (reaction) {
    const emoji = reaction.emoji.name;
    const user = reaction.users.cache.find(
      (user) => user.id !== client.user?.id
    );
    if (emoji == '✅') {
      await modAccept(message, user, publicChannel, postUrl);
    } else if (emoji === '❌') {
      await modReject(message, user);
    }
  } else if (reason === 'time') {
    await autoMod(message, client, publicChannel, postUrl);
  }
};

const modAccept = async (
  message: Message,
  user: User | undefined,
  publicChannel: TextChannel,
  postUrl: string | undefined
) => {
  const embed = message.embeds[0];
  embed.setColor('#38A169');
  message.edit('', embed);
  await message.edit(`\`✅ ACCEPTED\` by ${user ?? 'unknown'}`, embed);
  embed.setColor('#805AD5');
  await publicChannel.send(embed);
  if (postUrl) postToUrl(embed, postUrl);
  await message.reactions.removeAll();
};

const modReject = async (message: Message, user: User | undefined) => {
  const embed = message.embeds[0];
  embed.setColor('#E53E3E');
  await message.edit(`\`❌ REJECTED\` by ${user ?? 'unknown'}`, embed);
  await message.reactions.removeAll();
};

const autoMod = async (
  message: Message,
  client: Client,
  publicChannel: TextChannel,
  postUrl: string | undefined
) => {
  const url = message.embeds[0].url;
  const ok = await getSubmissionOk(url);
  if (ok) {
    const embed = message.embeds[0];
    embed.setColor('#38A169');
    message.edit('', embed);
    await message.edit(`\`✅ ACCEPTED\` by ${client.user} (automodded)`, embed);
    embed.setColor('#805AD5');
    await publicChannel.send(embed);
    if (postUrl) postToUrl(embed, postUrl);
    await message.reactions.removeAll();
  } else {
    const embed = message.embeds[0];
    embed.setColor('#E53E3E');
    await message.edit(`\`❌ REJECTED\` by ${client.user} (automodded)`, embed);
    await message.reactions.removeAll();
  }
};

const postToUrl = async (embed: MessageEmbed, url: string) => {
  try {
    const postTitle =
      embed.title?.length ?? 0 < 100
        ? embed.title
        : `${embed.title?.substring(0, 100)}`;
    const message = `${postTitle}\n\n${embed.footer?.text}\n\n${embed.url}`;
    const body = JSON.stringify({ message });

    await fetch(url, { body, method: 'POST' });
  } catch (error) {
    // do nothing
  }
};
