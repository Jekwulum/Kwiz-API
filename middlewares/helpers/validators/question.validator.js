const Joi = require('joi');


const addQuestion = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  options: Joi.array().required(),
  points: Joi.number().required()
});

const updateQuestion = Joi.object({
  players: Joi.array().required()
});

module.exports = { addQuestion, updateQuestion };