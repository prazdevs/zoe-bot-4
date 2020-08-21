import Snoowrap, { Listing, Submission, Subreddit } from 'snoowrap';
import { parse as parseUrl } from 'url';

export class RedditFetcher {
  private snoowrap: Snoowrap;

  constructor() {
    this.snoowrap = new Snoowrap({
      userAgent: 'zoe-bot',
      clientId: process.env.REDDIT_APP_ID,
      clientSecret: process.env.REDDIT_APP_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    });
  }

  async getLatestSubmissions(
    subreddit: string,
    limit: number
  ): Promise<Listing<Submission>> {
    return await this.snoowrap.getSubreddit(subreddit).getNew({ limit });
  }

  async getSubredditIcon(subreddit: string): Promise<string | null> {
    try {
      return await this.snoowrap
        .getSubreddit(subreddit)
        .fetch()
        .then((s) => {
          const parsed = parseUrl(s.community_icon);
          return `https://${parsed.hostname}${parsed.pathname}`;
        });
    } catch (error) {
      return null;
    }
  }
}
