import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
  USERS_MICROSERVICE_HOST: string;
  USERS_MICROSERVICE_PORT: number;
  JWT_SECRET: string;
  FACTURAS_MICROSERVICE_HOST: string;
  FACTURAS_MICROSERVICE_PORT: number;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    FACTURAS_MICROSERVICE_HOST: joi.string().required(),
    FACTURAS_MICROSERVICE_PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    ALLOWED_ORIGINS: joi.string().default('http://localhost:4200,http://localhost:3000'),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  PRODUCTS_MICROSERVICE_HOST: envVars.PRODUCTS_MICROSERVICE_HOST,
  PRODUCTS_MICROSERVICE_PORT: envVars.PRODUCTS_MICROSERVICE_PORT,
  USERS_MICROSERVICE_HOST: envVars.USERS_MICROSERVICE_HOST,
  USERS_MICROSERVICE_PORT: envVars.USERS_MICROSERVICE_PORT,
  JWT_SECRET: envVars.JWT_SECRET,
  FACTURAS_MICROSERVICE_HOST: envVars.FACTURAS_MICROSERVICE_HOST,
  FACTURAS_MICROSERVICE_PORT: envVars.FACTURAS_MICROSERVICE_PORT,
  NODE_ENV: envVars.NODE_ENV,
  ALLOWED_ORIGINS: envVars.ALLOWED_ORIGINS,
};
