const { array } = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
  question: {
    type: String,
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