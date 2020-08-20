import { RuleRepository } from './repositories/RuleRepository';
import { DiscordClient } from './DiscordClient';
import { removeDuplicates } from './utils';
import { Rule } from './entities/Rule';

async function iterate(
  ruleRepository: RuleRepository,
  discordClient: DiscordClient
): Promise<void> {
  const rules = await ruleRepository.allRules();
  const subreddits: string[] = rules.map((rule) => rule.reddit);
  const uniqueSubreddits = removeDuplicates(subreddits);
  const posts = await queryReddit(uniqueSubreddits);
  posts.forEach((postList) => {
    const rulesToPost = rules.filter(
      (rule) => rule.reddit === postList.subreddit
    );
    rulesToPost.forEach((rule) => {
      handlePosting(rule, postList.posts);
    });
  });
}

async function queryReddit(
  subreddits: string[]
): Promise<{ subreddit: string; posts: string[] }[]> {
  const res: { subreddit: string; posts: string[] }[] = [];
  subreddits.forEach((subreddit) => {
    //todo query posts
    res.push({ subreddit, posts: ['post1', 'post2'] });
  });
  return res;
}

async function handlePosting(rule: Rule, posts: string[]): Promise<void> {
  posts.forEach((post) => console.log('I need to post ', post));
}
