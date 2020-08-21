import { Connection } from 'typeorm';
import { Rule } from '../entities/Rule';

export async function getRules(connection: Connection) {
  const ruleRepo = connection.getRepository(Rule);
  return await ruleRepo.find();
}
