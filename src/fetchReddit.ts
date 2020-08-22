import Snoowrap, { Submission } from 'snoowrap';
import { parse as parseUrl } from 'url';

export interface SubmissionCollection {
  subreddit: string;
  submissions: Submission[];
}

const getSnoowrap = () => {
  return new Snoowrap({
    userAgent: 'zoe-bot',
    clientId: process.env.REDDIT_APP_ID,
    clientSecret: process.env.REDDIT_APP_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });
};

export const getIcon = async (subreddit: string): Promise<string> => {
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
    return '';
  }
};

export const getSubmissionOk = async (
  url: string | undefined
): Promise<boolean> => {
  const snoowrap = getSnoowrap();
  if (!url) return false;

  const id = parseUrl(url).pathname?.split('/')[4];
  if (!id) return false;

  try {
    return await snoowrap
      .getSubmission(id)
      .fetch()
      .then((s) => {
        return s.selftext !== '[deleted]' && s.selftext !== '[removed]';
      });
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getLatestSubmissions = async (
  subreddit: string
): Promise<Submission[]> => {
  const snoowrap = getSnoowrap();
  try {
    const listing = await snoowrap.getSubreddit(subreddit).getNew();
    return [...listing];
  } catch (error) {
    return [];
  }
};

export const getLatestSubmissionsSince = async (
  subreddit: string,
  seconds: number
): Promise<Submission[]> => {
  const submissions = await getLatestSubmissions(subreddit);
  return submissions.filter((s) => Date.now() / 1000 - s.created_utc < seconds);
};

export const getLatestCollectionSince = async (
  subreddit: string,
  seconds: number
): Promise<SubmissionCollection> => {
  const submissions = await getLatestSubmissionsSince(subreddit, seconds);
  return { subreddit, submissions };
};

export const getLatestCollectionsSince = async (
  subreddits: string[],
  seconds: number
): Promise<SubmissionCollection[]> => {
  const promises = subreddits.map((s) => getLatestCollectionSince(s, seconds));
  return Promise.all(promises);
};
