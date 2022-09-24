const { generateCode } = require('../middlewares/utils/code_generator');
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const QuestionModel = require('../models/questions.model');
const { update } = require('../models/questions.model');

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
  },

  addPlayers: async (req, res) => {
    QuestionModel.findOne({ code: req.params.code }, async (err, doc) => {
      if (err || !doc) res.status(400).json({ message: "Record not found", status: "FAILED" })
      else {
        let otherPlayers = [];
        let playersArr = doc.players;
        for (let player of req.body.players) {
          if (!playersArr.some(playerObj => playerObj.player === player)) {
            let newPlayer = { player, score: 0 }
            playersArr.push(newPlayer);
          } else otherPlayers.push(player);
        };

        QuestionModel.updateOne({ code: req.params.code }, { players: playersArr }, (err) => {
          if (err) res.status(400).json({ status: "FAILED", message: err + "here" })
          else {
            let message = "Player(s) successfully added. ";
            if (otherPlayers.length > 0) message += `${otherPlayers.join(', ')} already selected`;
            res.status(200).json({ status: "SUCCESS", message });
          }
        });
      }
    });
  },

  updateScores: async (req, res) => {
    QuestionModel.findOne({ code: req.params.code }, async (err, doc) => {
      if (err || !doc) res.status(404).json({ message: "Record not found", status: "FAILED" })
      else {
        let oldPlayersArr = doc.players;
        let newPlayersArr = req.body.players;

        let updatedArr = oldPlayersArr.reduce((acc, curr) => {
          const exists = newPlayersArr.find((newPlayerObj) => curr.player == newPlayerObj.player);
          if (exists) {
            curr.score += exists.score;
            acc.push(curr);
          } else acc.push(curr);

          return acc;
        }, []);
        
        QuestionModel.updateOne({ code: req.params.code }, { players: updatedArr }, (err) => {
          if (err) res.status(400).json({ status: "FAILED", message: err });
          else res.status(200).json({ status: "SUCCESS", message: "Records successfully updated" });
        });
      }
    })
  }
};

module.exports = QuestionController;