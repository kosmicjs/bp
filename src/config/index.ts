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
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('localhost'),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export const config = {
  port: env.PORT,
  db: {
    host: env.DB_HOST,
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    endpointSecret: env.STRIPE_ENDPOINT_SECRET,
  },
};
