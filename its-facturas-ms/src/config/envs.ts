import 'dotenv/config'
import * as joi from 'joi';

interface EnvVars {
  FACTURAS_PORT: number;
  FACTURAS_HOST: string;
  DATABASE_URL: string;
}

const envsSchema = joi.object({
  FACTURAS_PORT: joi.number().required(),
  FACTURAS_HOST: joi.string().required(),
  DATABASE_URL: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate( process.env );

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  FACTURAS_PORT: envVars.FACTURAS_PORT,
  FACTURAS_HOST: envVars.FACTURAS_HOST,
  DATABASE_URL: envVars.DATABASE_URL,
};
