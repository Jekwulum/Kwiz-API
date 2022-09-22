const Joi = require('joi');

const createUser = Joi.object({
  firstNmae: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
  re_password: Joi.string().required()
});

module.exports = { createUser };