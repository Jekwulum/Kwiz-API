const { generateCode } = require('../middlewares/utils/code_generator');
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const QuestionModel = require('../models/questions.model');

const QuestionController = {
  get: async (req, res) => {
    const data = await QuestionModel.find();
    res.status(200).json({ status: "SUCCESS", message: "Successfully fetched all data", data });
  },

  create: async (req, res) => {
    let data = req.body;
    data.userId = req.user.userId;
    data.code = generateCode();

    try {
      let question = new QuestionModel(data);
      await question.save(async (err, dataObject) => {
        if (err) {
          const response = databaseError(err);
          res.status(response.status).json({ status: "FAILED", message: response.message });
        } else res.status(201).json({ status: "SUCCESS", message: "Question added", data: question });
      })
    } catch (error) {
      res.status(500).json({ status: "FAILED", message: error });
    }
  }
};

module.exports = QuestionController;