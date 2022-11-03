const bcrypt = require('bcrypt');
const config = process.env;
const TokenService = require('../middlewares/helpers/services/token.service');
const { cipherEncrypt, cipherDecrypt } = require('../middlewares/helpers/services/encryption.service');
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const { generateCode } = require('../middlewares/utils/code_generator');
const sendEmail = require('../middlewares/utils/sendEmail');
const EncryptionStoreModel = require('../models/encryption.store.model');
const TokenModel = require('../models/token.model');
const UserModel = require('../models/user.model');

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email }, async (error, dataExists) => {
      if (error || !dataExists) res.status(404).json({ status: "FAILED", message: "Invalid login credentials" })
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

  changePassword: (req, res) => {
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
  },

  forgotPasswordLink: async (req, res) => {
    try {
      let email = req.body.email
      UserModel.findOne({ email }, async (error, userExists) => {
        if (error || !userExists) res.status(404).json({ status: "FAILED", message: "user record not found" })
        else {
          let userRef = 'ClientUsers';
          if (userExists.is_admin) userRef = 'AdminUsers';
          const token = await TokenService.generateToken(userExists.userId, email, userRef);
          const encryptedToken = cipherEncrypt(token);

          EncryptionStoreModel.create({ cipher: encryptedToken.cipher, iv: encryptedToken.iv, key: encryptedToken.key }, async (err, doc) => {
            if (err) res.status(500).json({ status: "FAILED", message: "Unable to store cipher data" })
            else {
              const resetLink = `${config.BASE_URL}/auth/reset-forgot-password/${encryptedToken.cipher}`;
              const emailObj = { email: userExists.email, subject: "password reset", text: resetLink };
              await sendEmail(emailObj);
              res.status(200).json({ status: "SUCCESS", message: "password reset link sent to yout email address" });
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "FAILED", message: "an error occurred" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      EncryptionStoreModel.findOneAndDelete({ cipher: req.params.resetCode }, async (error, validationData) => {
        if (error || !validationData) return res.status(404).json({ status: "FAILED", message: "cipher not found" });
        else {
          let data = { key: validationData.key, iv: validationData.iv, cipher: validationData['cipher'] };
          const decryptedValue = cipherDecrypt(data);
          TokenModel.findOneAndDelete({ token: decryptedValue }, async (err, verifiedTokenData) => {
            if (err) return res.status(404).json({ status: "FAILED", message: "token not found" });
            else {
              bcrypt.genSalt(Number(config.SALT_RATE), (saltError, salt) => {
                if (saltError) { res.status(500).json({ status: "FAILED", message: "Salt Error" }) }
                else {
                  const password = generateCode();
                  bcrypt.hash(password, salt, async (hashError, hash) => {
                    if (hashError) res.status(400).json({ status: "FAILED", message: `FAILURE, Password not found ${hashError}` })
                    else {
                      UserModel.findOneAndUpdate({ userId: verifiedTokenData['userId'] }, { password: hash }, { new: true }, async (err, doc) => {
                        
                        if (err) {
                          const response = databaseError(err);
                          res.status(response.status).json({ status: "FAILED", message: response.message });
                        }
                        else {
                          const emailObj = { email: doc.email, subject: "password changed", text: `New password: ${password}` };
                          await sendEmail(emailObj);
                          res.status(200).json({ status: "SUCCESS", message: "password successfully changed, check email" })
                        };
                      });
                    }
                  })
                }
              })
            }
          });
        }
      })
    } catch (error) {

    }
  }
};

module.exports = AuthController;