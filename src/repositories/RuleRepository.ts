import { Repository, EntityRepository } from 'typeorm';
import { Rule } from '../entities/Rule';
import { IRuleRepository } from './IRuleRepository';

@EntityRepository(Rule)
export class RuleRepository extends Repository<Rule>
  implements IRuleRepository {
  async allRules(): Promise<Rule[]> {
    return await this.find();
  }

  async addRule({ guild, reddit, modChan, publicChan, icon }: Rule): Promise<Rule> {
    const rule = new Rule();
    rule.guild = guild;
    rule.reddit = reddit;
    rule.modChan = modChan;
    rule.publicChan = publicChan;
    rule.icon = icon;

    return await this.save(rule);
  }

  async removeRule(id: number): Promise<void> {
    await this.delete(id);
  }

  async removeGuildRules(guild: string): Promise<number> {
    const res = await this.delete({ guild: guild });
    return res.affected ?? 0;
  }
}
