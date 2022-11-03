const bcrypt = require('bcrypt');
const config = process.env;
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const TokenService = require('../middlewares/helpers/services/token.service');
const UserModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');

const UserController = {
  createUser: async (req, res) => {
    UserModel.findOne({ email: req.body.email }, (error, userExists) => {

      if (error) {
        const response = databaseError(error);
        res.status(response.status).json({ status: "FAILED", message: response.message });
      } else if (userExists) res.status(400).json({ status: "FAILED", message: "User already exists" })
      else {
        bcrypt.genSalt(Number(config.SALT_RATE), (saltError, salt) => {
          if (saltError) { console.log("salt error::: ", saltError) }
          else {
            bcrypt.hash(req.body.password, salt, async (hashError, hash) => {
              if (hashError) res.status(400).json({ status: "FAILED", message: `FAILURE, Password not found ${hashError}` })
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
    let responseData = [];
    for (let eachData of data) {
      eachData = eachData.toObject();
      delete eachData.password;
      responseData.push(eachData);
    }
    res.status(200).json({ status: "SUCCESS", message: "Successfully fetched all data", data: responseData });
  },

  getByEmail: async (req, res) => {
    const data = await UserModel.findOne({ email: req.params.email });
    delete data.password;
    if (data) res.status(200).json({ status: "SUCCESS", message: "Successfully fetched data", data })
    else res.status(400).json({ status: "FAILED", message: "Record not found" });
  },

  getById: async (req, res) => {
    const data = await UserModel.findOne({ userId: req.params.id });
    delete data.password;
    if (data) res.status(200).json({ status: "SUCCESS", message: "Successfully fetched data", data })
    else res.status(400).json({ status: "FAILED", message: "Record not found" });
  },

  delete: async (req, res) => {
    const userExists = await UserModel.findOne({ userId: req.params.id });
    if (userExists) {
      UserModel.deleteOne({ userId: req.params.id })
        .then(() => {
          console.log("deleted");
          return res.status(200).json({ status: "SUCCESS", message: "Delete Successful" });
        })
        .catch(error => {
          console.log(error);
          res.status(400).json({ status: "FAILED", message: error })
        });
    } else {
      return res.status(404).json({ message: "Record not found", status: "FAILED" });
    };
  },

  patch: async (req, res) => {
    const update = req.body;
    UserModel.findOneAndUpdate({ userId: req.params.id }, update, { new: true }, (err, doc) => {
      if (err) {
        const response = databaseError(err);
        res.status(response.status).json({ status: "FAILED", message: response.message });
      }
      else res.status(200).json({ status: "SUCCESS", message: "SUCCESS" })
    });
  }
};

module.exports = UserController;