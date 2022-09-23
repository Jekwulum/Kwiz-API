const Joi = require('joi');


const addQuestion = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  points: Joi.number().required()
});

module.exports = { addQuestion };