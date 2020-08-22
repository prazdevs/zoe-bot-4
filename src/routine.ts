import { Connection } from 'typeorm';
import { Client, TextChannel } from 'discord.js';
import { Rule } from './entities/Rule';
import { getLatestCollectionsSince } from './fetchReddit';
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
      const publicChannel = client.channels.cache.get(
        rule.publicChan
      ) as TextChannel;
      const submissions =
        collections.find((c) => c.subreddit === rule.reddit)?.submissions ?? [];
      submissions?.forEach(async (s) => {
        const embed = buildEmbed(s, rule.icon || '');
        await publicChannel.send(embed);
      });
    });
  };

  await routine();
  setInterval(routine, delay * 1000);
};
