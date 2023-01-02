const Joi = require('joi');


const addQuestion = Joi.object({
  title: Joi.string().required(),
  questions: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      points: Joi.number().required(),
      options: Joi.array().required(),
    })
  )
})

const updateQuestion = Joi.object({
  players: Joi.array().required()
});

const addPlayer = Joi.object({
  playerId: Joi.string().required()
});

module.exports = { addPlayer, addQuestion, updateQuestion };