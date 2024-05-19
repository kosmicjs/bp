import process from 'node:process';
import dotenv from 'dotenv';
import z from 'zod';
import defaults from 'defaults';

dotenv.config();

const nodeEnv = z
  .enum(['development', 'production', 'test'])
  .default('development')
  .parse(process.env.NODE_ENV);

const kosmicEnv = z
  .enum(['development', 'production', 'migration', 'test'])
  .default('development')
  .parse(process.env.KOSMIC_ENV);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const envSchema = z
  .object({
    PORT: z.string(),
    SERVER_HOST: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_ENDPOINT_SECRET: z.string(),
    DB_HOST: z.string(),
    DB_DATABASE: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_CONNECTION_STRING: z.string(),
  })
  .partial();

const env = envSchema.parse(process.env);

export const stripeSchema = z.object({
  secretKey: z.string(),
  endpointSecret: z.string(),
});

export const configSchema = z.object({
  nodeEnv: z.literal(nodeEnv),
  kosmicEnv: z.literal(kosmicEnv),
  port: z.coerce.number().default(3000),
  host: z.string().default('127.0.0.1'),
  pg: z.intersection(
    z.object({
      max: z.number().optional(),
      idleTimeoutMillis: z.number().optional(),
      connectionTimeoutMillis: z.number().optional(),
    }),
    z.union([
      z.object({
        host: z.string().default('localhost'),
        user: z.string().optional(),
        database: z.string(),
        password: z.string().optional(),
      }),
      z.object({
        connectionString: z.string(),
      }),
    ]),
  ),
  stripe: stripeSchema.partial(),
});

const configByEnv = {
  default: {
    ...env,
    nodeEnv,
    kosmicEnv,
    port: env.PORT,
    host: env.SERVER_HOST,
    pg: {
      connectionString: env.DB_CONNECTION_STRING,
      user: env.DB_USER,
      database: env.DB_DATABASE,
      password: env.DB_PASSWORD,
      host: env.DB_HOST,
    },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2000,
  },
  development: {
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      endpointSecret: env.STRIPE_ENDPOINT_SECRET,
    },
  },
  production: {
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      endpointSecret: env.STRIPE_ENDPOINT_SECRET,
    },
  },
  test: {},
};

export const config = configSchema.parse(
  defaults(configByEnv[nodeEnv], configByEnv.default),
);
