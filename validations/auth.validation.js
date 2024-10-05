const joi = require('joi');
const loginSchema = {
    body: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }),
};

module.exports = {
    loginSchema,
}