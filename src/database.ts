import { createConnection } from 'typeorm';
import { Rule } from './entities/Rule';

export async function getConnection() {
  return await createConnection({
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    entities: [Rule],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
  });
}
