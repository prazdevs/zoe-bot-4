import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { Rule } from './entities/Rule';
import { RuleRepository } from './repositories/RuleRepository';
import { IRuleRepository } from './repositories/IRuleRepository';
import { DiscordClient } from './DiscordClient';

let _connection: Connection;

export async function connect(): Promise<void> {
  _connection = await createConnection({
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    entities: [Rule],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
  });
}

export function getRuleRepository(): IRuleRepository {
  return _connection.getCustomRepository(RuleRepository);
}

// const client = new DiscordClient();
//client.connect().then(() => console.log('connected'));