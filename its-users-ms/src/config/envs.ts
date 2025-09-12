import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  AUTH_PORT: number;
  AUTH_HOST: string;
}

const envsSchema = joi
  .object({
    AUTH_PORT: joi.number().required(),
    AUTH_HOST: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  AUTH_PORT: envVars.AUTH_PORT,
  AUTH_HOST: envVars.AUTH_HOST,
};
