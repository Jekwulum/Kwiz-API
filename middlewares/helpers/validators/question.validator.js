const Joi = require('joi');


const addQuestion = Joi.object({
  question: Joi.string().required(),
  code: Joi.string().required(),
  players: Joi.array()
});

module.exports = { addQuestion };