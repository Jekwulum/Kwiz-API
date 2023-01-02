const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const quizTitleSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

quizTitleSchema.plugin(uniqueValidator);
const QuizTitles = mongoose.model('QuizTitles', quizTitleSchema);

module.exports = QuizTitles;