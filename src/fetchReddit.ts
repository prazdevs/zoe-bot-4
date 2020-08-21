import Snoowrap from 'snoowrap';
import { parse as parseUrl } from 'url';

function getSnoowrap() {
  return new Snoowrap({
    userAgent: 'zoe-bot',
    clientId: process.env.REDDIT_APP_ID,
    clientSecret: process.env.REDDIT_APP_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });
}

export async function getIcon(subreddit: string) {
  try {
    const snoowrap = getSnoowrap();
    return await snoowrap
      .getSubreddit(subreddit)
      .fetch()
      .then((s) => {
        const parsed = parseUrl(s.community_icon);
        return `https://${parsed.hostname}${parsed.pathname}`;
      });
  } catch (error) {
    return undefined;
  }
}

export async function getLatestSubmissions(subreddit: string, limit: number) {
  const snoowrap = getSnoowrap();
  try {
    const listing = await snoowrap.getSubreddit(subreddit).getNew({ limit });
    return [...listing];
  } catch (error) {
    return [];
  }
}
