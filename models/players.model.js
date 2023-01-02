const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const playersSchema = new Schema({
  quizId: {
    type: String,
    required: true
  },
  playerId: {
    type: String,
  },
  points: {
    type: Number,
    default: 0
  }
});

playersSchema.plugin(uniqueValidator);
const Players = mongoose.model('Players', playersSchema);

module.exports = Players;