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
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  SERVER_HOST: z.string().default('127.0.0.1'),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
});

export const envDbSchema = z.union([
  z.object({
    DB_HOST: z.string().default('localhost'),
    DB_DATABASE: z.string(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
  }),
  z.object({
    DB_CONNECTION_STRING: z.string(),
  }),
]);

const env = z.intersection(envSchema, envDbSchema).parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.SERVER_HOST,
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    endpointSecret: env.STRIPE_ENDPOINT_SECRET,
  },
  pg: {
    ...('DB_CONNECTION_STRING' in env
      ? {
          connectionString: env.DB_CONNECTION_STRING,
        }
      : {
          user: env.DB_USER,
          database: env.DB_DATABASE,
          password: env.DB_PASSWORD,
          host: env.DB_HOST,
        }),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2000,
  },
};
