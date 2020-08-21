import { Connection } from 'typeorm';
import { Rule } from '../entities/Rule';
import { getIcon } from '../fetchReddit';

export async function addRule(
  connection: Connection,
  { guild, reddit, publicChan, modChan }: Rule
) {
  const ruleRepo = connection.getRepository(Rule);

  const rule = new Rule();
  rule.guild = guild;
  rule.reddit = reddit;
  rule.publicChan = publicChan;
  rule.modChan = modChan;

  rule.icon = await getIcon(reddit);

  await ruleRepo.save(rule);
}
