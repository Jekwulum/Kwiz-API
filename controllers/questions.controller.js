const { generateCode } = require('../middlewares/utils/code_generator');
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const QuestionModel = require('../models/questions.model');

const QuestionController = {
  get: async (req, res) => {
    const data = await QuestionModel.find();
    res.status(200).json({ status: "SUCCESS", message: "Successfully fetched all data", data });
  }
};

module.exports = QuestionController;