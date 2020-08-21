import { Submission } from 'snoowrap';
import { MessageEmbed } from 'discord.js';

export const buildEmbed = (
  submission: Submission,
  redditIcon: string
): MessageEmbed => {
  const embed = new MessageEmbed();

  embed.setAuthor(submission.author.name);
  embed.setTitle(submission.title);
  embed.setURL(`http://reddit.com${submission.permalink}`);

  if (submission.is_self) {
    embed.setDescription(submission.selftext);
  } else if (submission.media) {
    embed.setImage(submission.thumbnail);
    embed.setDescription('This post contains media...');
  } else {
    embed.setImage(submission.url);
  }

  embed.setThumbnail(redditIcon);

  embed.setFooter(
    `Posted by u/${submission.author.name}`,
    'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png'
  );

  return embed;
};
