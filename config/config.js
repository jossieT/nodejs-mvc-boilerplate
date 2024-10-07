const { envValidation } = require('../validations');
//const logger = require('./logger');
require('dotenv').config();


// validating the enviroment variable against the schema.
const { value: envVars, error } = envValidation.validate(process.env);

if (error) {
    //logger.error(`Config validation error: ${error.message}`);
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    port: envVars.PORT,
    db_connection: envVars.DB_CONNECTION,
    env: envVars.NODE_ENV,
    jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_EXPIRATION_MINUTES || 30,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS || 30
}
}