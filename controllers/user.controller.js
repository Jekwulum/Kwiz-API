const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const config = process.env;
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const TokenService = require('../middlewares/helpers/services/token.service');
const UserModel = require('../models/user.model');
const {v4: uuidv4} = require('uuid');

const UserController = {
  createUser: async (req, res) => {
    UserModel.findOne({ email: req.body.email }, (error, userExists) => {

      if (error) {
        const response = databaseError(error);
        res.status(response.status).json({ status: response.message });
      } else if (userExists) res.status(400).json({ status: "FAILED", message: "User already exists" })
      else {
        bcrypt.genSalt(Number(config.SALT_RATE), (saltError, salt) => {
          if (saltError) { console.log("salt error::: ", saltError) }
          else {
            bcrypt.hash(req.body.password, salt, async (hashError, hash) => {
              if (hashError) res.status(400).json({ status: "FAILED", message: `FAILURE, Password not found ${error}` })
              else {
                let data = req.body;
                let userRef = 'ClientUsers';
                if (req.body.is_admin === true) { userRef = 'AdminUsers' };
                let user = new UserModel(data);
                user.password = hash;
                user.userId = uuidv4();
                await user.save(async (err, dataObject) => {
                  if (err) {
                    const response = databaseError(err);
                    res.status(response.status).json({ status: "FAILED", message: response.message });
                  } else {
                    const token = await TokenService.generateToken(dataObject._id, dataObject.email, userRef);
                    return res.status(201).json({ status: "SUCCESS", access: token });
                  }
                });
              }
            })
          }
        })
      }
    });
  },

  get: async (req, res) => {
    const data = await UserModel.find();
    res.status(200).json({ status: "SUCCESS", message: "Successfully fetched all data", data });
  },

  getByEmail: async (req, res) => {
    const data = await UserModel.findOne({ email: req.params.email });
    if (data) res.status(200).json({ status: "SUCCEsS", message: "Successfully fetched data", data })
    else res.status(400).json({ status: "FAILED", message: "Couldn't fetch data" });
  },

  getById: async (req, res) => {
    const data = await UserModel.findOne({ userId: req.params.id });
    if (data) res.status(200).json({ status: "SUCCEsS", message: "Successfully fetched data", data })
    else res.status(400).json({ status: "FAILED", message: "Couldn't fetch data" });
  },

  delete: async (req, res) => {
    const userExists = await UserModel.findOne({ _id: req.params.id });
    if (userExists) {
      UserModel.deleteOne({ _id: req.params.id })
        .then(() => {
          console.log("deleted");
          return res.status(200).json({ status: "SUCCESS", message: "Successful" });
        })
        .catch(error => {
          console.log(error);
          res.status(400).json({ status: "FAILED", message: error })
        });
    } else {
      return res.status(404).json({ message: "Record not found", status: "FAILED" });
    };
  }
};

module.exports = UserController;