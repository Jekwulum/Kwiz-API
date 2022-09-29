const bcrypt = require('bcrypt');
const config = process.env;
const TokenService = require('../middlewares/helpers/services/token.service');
const TokenModel = require('../models/token.model');
const UserModel = require('../models/user.model');

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email }, async (error, dataExists) => {
      if (error || !dataExists) res.status(400).json({ status: "FAILED", message: "Invalid login credentials" })
      else {
        bcrypt.compare(password, dataExists.password, async (err, response) => {
          if (err || !response) res.status(400).json({ status: "FAILED", message: "Invalid login credentials" })
          else {
            if (dataExists.status === false) res.status(403).json({ status: "FAILED", message: "Account is disabled, contact support" })
            else {
              let userRef = 'ClientUsers';
              if (dataExists.is_admin) userRef = 'AdminUsers';
              const token = await TokenService.generateToken(dataExists.userId, email, userRef);
              TokenModel.findOneAndUpdate({ userId: dataExists.userId }, token, { new: true }, (err, _) => {
                if (err) res.status(400).json({ status: "FAILED", message: err });
                else res.status(200).json({ status: "SUCCESS", access: token });
              })
            }
          }
        })
      }
    });
  },

  logout: (req, res) => {
    const userId = TokenService.getValue(req, 'userId');
    TokenModel.deleteMany({ userId }, async (err) => {
      if (err) res.status(400).json({ status: "FAILED", message: "Logout failed" })
      else res.status(200).json({ status: "SUCCESS", message: "Logout successful" })
    })
  },

  resetPassword: (req, res) => {
    const userId = req.user['userId'];
    bcrypt.genSalt(Number(config.SALT_RATE), async (saltError, salt) => {
      if (saltError) res.status(400).json({ status: "FAILED", message: saltError });
      else {
        bcrypt.hash(req.body.password, salt, async (hashError, hash) => {
          if (hashError) res.status(400).json({ status: "FAILED", message: `FAILURE, Password not found ${error}` });
          else {
            UserModel.findOneAndUpdate({ userId }, { password: hash }, { new: true }, (err, doc) => {
              if (err) {
                const response = databaseError(err);
                res.status(response.status).json({ status: "FAILED", message: response.message });
              }
              else res.status(200).json({ status: "SUCCESS", message: "password successfully changed" });
            });
          }
        });
      }
    });
  }
};

module.exports = AuthController;