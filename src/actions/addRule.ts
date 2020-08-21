import { ruleRepository } from '../database';
import { Rule } from '../entities/Rule';

export async function addRule({ guild, reddit, publicChan, modChan }: Rule) {
  const ruleRepo = await ruleRepository();

  const rule = new Rule();
  rule.guild = guild;
  rule.reddit = reddit;
  rule.publicChan = publicChan;
  rule.modChan = modChan;

  await ruleRepo.save(rule);
}
