import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envVarsSchema = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
}).unknown(true);

const validationResult = envVarsSchema.validate(process.env);

if (validationResult.error) {
  throw new Error(`Config validation error: ${validationResult.error.message}`);
}

const envVars: EnvVars = validationResult.value as EnvVars;

export const envs = {
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
};
