import { IRuleRepository } from './IRuleRepository';
import { Rule } from '../entities/Rule';

export class MockRuleRepository implements IRuleRepository {
  rules: Rule[] = [];

  async allRules(): Promise<Rule[]> {
    return this.rules;
  }

  async addRule(rule: Rule): Promise<Rule> {
    if (
      this.rules.some((r) => r.guild === rule.guild && r.reddit === rule.reddit)
    ) {
      throw new Error();
    }
    this.rules.push(rule);
    return rule;
  }

  async removeRule(id: number): Promise<void> {
    this.rules = this.rules.filter((rule) => rule.id !== id);
  }

  async removeGuildRules(guild: string): Promise<number> {
    const oldLength = this.rules.length;
    this.rules = this.rules.filter((rule) => rule.guild !== guild);
    return oldLength - this.rules.length;
  }
}
