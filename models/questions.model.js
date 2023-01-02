const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
  userId: { // this is also the quizId
    type: String,
    required: true
  },
  code: {
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
  options: {
    type: [String],
    required: true
  },
}, {
  timestamps: true
});

questionsSchema.plugin(uniqueValidator);
const Questions = mongoose.model('Questions', questionsSchema);

module.exports = Questions;