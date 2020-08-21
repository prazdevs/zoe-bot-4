import { ruleRepository } from "../database";

export async function getRules() {
  const ruleRepo = await ruleRepository();
  return await ruleRepo.find();
}