const joi = require('joi');

const envVarSchema = joi
  .object({
    DB_CONNECTION: joi.string().required(),
    PORT: joi.number().positive().default(3000),
    MAX_ATTEMPTS_BY_IP_USERNAME: joi.number(),
    MAX_ATTEMPTS_PER_DAY: joi.number(),
    MAX_ATTEMPTS_PER_EMAIL: joi.number(),
  })
  .unknown(); //Allow other unknown enviroment viriables

module.exports = envVarSchema;
