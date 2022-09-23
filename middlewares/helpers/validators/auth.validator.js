const Joi = require('joi');

const createUser = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
  re_password: Joi.any().equal(Joi.ref('password')).required().options({ messages: { 'any.only': 'passwords do not match' } }),
  is_admin: Joi.boolean()
});

const login = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
});

module.exports = { createUser, login };