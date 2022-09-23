const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    refPath: 'UsersRef',
    required: true
  },
  UsersRef: {
    type: String,
    required: true,
    enum: ['AdminUsers', 'ClientUsers']
  }
}, {
  timestamps: true
});

tokenSchema.plugin(uniqueValidator);
const AuthTokens = mongoose.model('AuthTokens', tokenSchema);

module.exports = AuthTokens;