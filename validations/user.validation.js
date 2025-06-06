const joi = require('joi');
const { password } = require('./custom.validation');

const createUserSchema = {
  body: joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.custom(password).required(),
  }),
};

module.exports = {
  createUserSchema,
};
