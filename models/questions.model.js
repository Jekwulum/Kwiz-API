const { array } = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  players: {
    type: [{ player: String, score: Number }]
  }
}, {
  timestamps: true
});

questionsSchema.plugin(uniqueValidator);
const Questions = mongoose.model('Questions', questionsSchema);

module.exports = Questions;