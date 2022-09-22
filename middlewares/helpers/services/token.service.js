require('dotenv').config();
const jwt = require('jsonwebtoken');
const TokenModel = require('../../../models/token.model');
const UserModel = require('../../../models/user.model');

const tokenService = {
  generateToken: (userId, email, UsersRef) => {
    const token = jwt.sign({ userId, email }, process.env.TOKEN_KEY, { expiresIn: "2h" });
    TokenModel.create({ token, userId, UsersRef }, (err, doc) => {
      if (err) res.status(400).json({ status: "FAILED", message: err });
    });

    return token;
  }
};

module.exports = tokenService;