import { Rule } from '../entities/Rule';

export interface IRuleRepository {
  allRules(): Promise<Rule[]>;
  addRule(rule: Rule): Promise<Rule>;
  removeRule(id: number): Promise<void>;
  removeGuildRules(guild: string): Promise<number>;
}
