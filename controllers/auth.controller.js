const bcrypt = require('bcrypt');
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
  }
};

module.exports = AuthController;