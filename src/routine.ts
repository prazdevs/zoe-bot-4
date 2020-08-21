import { Connection } from 'typeorm';
import { Client } from 'discord.js';
import { Rule } from './entities/Rule';

export const startRoutine = async (
  connection: Connection,
  client: Client,
  delay: number
): Promise<void> => {
  const routine = async () => {
    const rules = await connection.getRepository(Rule).find();
    const subreddits = [...new Set(rules)];
  };

  await routine();
  setInterval(routine, delay);
};
