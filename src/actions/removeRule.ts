import { ruleRepository } from "../database";

export async function removeRule(guild: string, reddit: string) {
  const repo = await ruleRepository();

  
}