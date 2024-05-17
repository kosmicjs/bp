/* eslint-disable @typescript-eslint/no-namespace */
import process from 'node:process';
import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  SERVER_HOST: z.string().default('127.0.0.1'),
  DB_HOST: z.string().default('localhost'),
  DB_DATABASE: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.SERVER_HOST,
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    endpointSecret: env.STRIPE_ENDPOINT_SECRET,
  },
  pg: {
    host: env.DB_HOST,
    database: env.DB_DATABASE,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2000,
  },
};
