import { Connection } from 'typeorm';
import { Rule } from '../entities/Rule';

export async function removeRule(
  connection: Connection,
  guild: string,
  reddit: string
) {
  const repo = connection.getRepository(Rule);
  await repo.delete({ guild, reddit });
}
