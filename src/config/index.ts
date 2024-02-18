import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  db: {
    host: process.env.DB_HOST ?? 'localhost',
  },
} as const;
