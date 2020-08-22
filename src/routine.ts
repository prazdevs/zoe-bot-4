import { Connection } from 'typeorm';
import { Client, TextChannel, MessageReaction, User } from 'discord.js';
import { Rule } from './entities/Rule';
import { getLatestCollectionsSince, getSubmissionOk } from './fetchReddit';
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
      const modChannel = client.channels.cache.get(
        rule.modChan ?? ''
      ) as TextChannel;

      const submissions =
        collections.find((c) => c.subreddit === rule.reddit)?.submissions ?? [];

      submissions?.forEach(async (s) => {
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
            const reaction = collected.first();

            if (reaction) {
              const emoji = reaction.emoji.name;
              const user = reaction.users.cache.find(
                (user) => user.id !== client.user?.id
              );
              if (emoji == '✅') {
                const embed = message.embeds[0];
                embed.setColor('#38A169');
                message.edit('', embed);
                await message.edit(
                  `\`✅ ACCEPTED\` by ${user ?? 'unknown'}`,
                  embed
                );
                embed.setColor('#805AD5');
                await publicChannel.send(embed);
                await message.reactions.removeAll();
              } else if (emoji === '❌') {
                const embed = message.embeds[0];
                embed.setColor('#E53E3E');
                await message.edit(
                  `\`❌ REJECTED\` by ${user ?? 'unknown'}`,
                  embed
                );
                await message.reactions.removeAll();
              }
            } else if (reason === 'time') {
              const url = message.embeds[0].url;
              const ok = await getSubmissionOk(url);
              if (ok) {
                const embed = message.embeds[0];
                embed.setColor('#38A169');
                message.edit('', embed);
                await message.edit(
                  `\`✅ ACCEPTED\` by ${client.user} (automodded)`,
                  embed
                );
                embed.setColor('#805AD5');
                await publicChannel.send(embed);
                await message.reactions.removeAll();
              } else {
                const embed = message.embeds[0];
                embed.setColor('#E53E3E');
                await message.edit(
                  `\`❌ REJECTED\` by ${client.user} (automodded)`,
                  embed
                );
                await message.reactions.removeAll();
              }
            }
          });
        } else {
          await publicChannel.send(embed);
        }
      });
    });
  };

  await routine();
  setInterval(routine, delay * 1000);
};
