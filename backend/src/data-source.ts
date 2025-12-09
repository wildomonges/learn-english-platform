import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';

const isDev = process.env.NODE_ENV !== 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrations: isDev ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'],
  entities: isDev ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
});
