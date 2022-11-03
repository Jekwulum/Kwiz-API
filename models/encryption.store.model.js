const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const encryptionStoreSchema = new Schema({
  cipher: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

encryptionStoreSchema.plugin(uniqueValidator);
const EncryptionStores = mongoose.model('EncryptionStores', encryptionStoreSchema);

module.exports = EncryptionStores;