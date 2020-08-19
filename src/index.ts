import { Connection, createConnection, getConnection } from 'typeorm';
import 'reflect-metadata';

var _connection: Connection;

createConnection({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [],
  synchronize: true,
})
  .then(() => console.log('connected'))
  .catch((error) => console.error(error));
