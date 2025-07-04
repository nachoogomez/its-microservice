import 'dotenv/config'
import * as joi from 'joi';

interface EnvVars {
  MS_PRODUCT_PORT: number;
  MS_PRODUCT_HOST: string; 
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

const envsSchema = joi.object({
    MS_PRODUCT_PORT: joi.string().required(),  
    MS_PRODUCT_HOST: joi.string().required(), 
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().allow(''), // Allow empty string for password
    DB_NAME: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate( process.env );

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  MS_PRODUCT_PORT: envVars.MS_PRODUCT_PORT,
  MS_PRODUCT_HOST: envVars.MS_PRODUCT_HOST,
  DB_HOST: envVars.DB_HOST,
  DB_PORT: envVars.DB_PORT,
  DB_USERNAME: envVars.DB_USERNAME,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_NAME: envVars.DB_NAME,
};
