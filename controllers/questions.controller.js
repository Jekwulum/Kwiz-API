const { generateCode } = require('../middlewares/utils/code_generator');
const { databaseError } = require('../middlewares/helpers/responses/database.response');
const PlayersModel = require('../models/players.model');
const QuestionModel = require('../models/questions.model');
const QuizTitlesModel = require('../models/quiz.title.model');

const QuestionController = {
  get: async (req, res) => {
    const data = await QuestionModel.find();
    res.status(200).json({ status: "SUCCESS", message: "Successfully fetched all data", data });
  },

  getByCode: async (req, res) => {
    QuestionModel.findOne({ code: req.params.code }, async (err, doc) => {
      if (err || !doc) res.status(404).json({ message: "Record not found", status: "FAILED" })
      else res.status(200).json({ status: "SUCCESS", message: "Successfully fetched record", data: doc });
    });
  },

  getByQuizId: async (req, res) => {
    QuestionModel.find({ quizId: req.params.quizId }, async (err, doc) => {
      if (err || !doc) res.status(404).json({ message: "Records not found", status: "FAILED" })
      else res.status(200).json({ status: "SUCCESS", message: "Successfully fetched records", data: doc });
    });
  },

  getByUserId: async (req, res) => {
    QuestionModel.find({ userID: req.params.userId }, async (err, doc) => {
      if (err || !doc) res.status(404).json({ message: "Records not found", status: "FAILED" })
      else res.status(200).json({ status: "SUCCESS", message: "Successfully fetched records", data: doc });
    });
  },

  create: async (req, res) => {
    let quizData = [];
    let quizId = generateCode();

    for (let data of req.body.questions) {
      if (!data.options.includes(data.answer)) return res.status(400).json({ status: "FAILED", message: `Answer: '${data.answer}' not in options: [${data.options}]` });

      data.quizId = quizId;
      data.userId = req.user.userId;
      data.code = generateCode();
      quizData.push(data);
    };

    QuestionModel.insertMany(quizData, (err, docs) => {
      if (err) {
        const response = databaseError(err);
        return res.status(response.status).json({ status: "FAILED", message: response.message });
      } else {
        QuizTitlesModel.create({ code: quizId, title: req.body.title }, (error, doc) => {
          if (error) {
            console.log(err);
          } else {
            let data = {};
            data['title'] = doc.title;
            data['questions'] = docs;
            return res.status(201).json({ status: "SUCCESS", message: "Question(s) added", data });
          }
        });
      }
    });
  },

  addPlayer: async (req, res) => {
    // QuestionModel.findOne({ code: req.params.code }, async (err, doc) => {
    //   if (err || !doc) res.status(404).json({ message: "Record not found", status: "FAILED" })
    //   else {
    //     let otherPlayers = [];
    //     let playersArr = doc.players;
    //     for (let player of req.body.players) {
    //       if (!playersArr.some(playerObj => playerObj.player === player)) {
    //         let newPlayer = { player, score: 0 }
    //         playersArr.push(newPlayer);
    //       } else otherPlayers.push(player);
    //     };

    //     QuestionModel.updateOne({ code: req.params.code }, { players: playersArr }, (err) => {
    //       if (err) res.status(400).json({ status: "FAILED", message: err + "here" })
    //       else {
    //         let message = "Player(s) successfully added. ";
    //         if (otherPlayers.length > 0) message += `${otherPlayers.join(', ')} already selected`;
    //         res.status(200).json({ status: "SUCCESS", message });
    //       }
    //     });
    //   }
    // });
    let playerId = req.body.playerId;
    PlayersModel.create({ quizId: req.params.quizId, playerId }, (err, doc) => {
      if (err) {
        const response = databaseError(err);
        return res.status(response.status).json({ status: "FAILED", message: response.message });
      }
      else {
        return res.status(201).json({ status: "SUCCESS", message: "Player added", data: doc });
      }
    });
  },

  getPlayersByQuizId: async (req, res) => {
    PlayersModel.find({ quizId: req.params.quizId }, (err, docs) => {
      if (err) {
        const response = databaseError(err);
        return res.status(response.status).json({ status: "FAILED", message: response.message });
      } else {
        return res.status(200).json({ status: "SUCCESS", data: docs });
      }
    })
  },

  getPlayerByQuizIdAndPlayerId: async (req, res) => {
    PlayersModel.findOne({ quizId: req.params.quizId, playerId: req.params.playerId }, (err, docs) => {
      if (err) {
        const response = databaseError(err);
        return res.status(response.status).json({ status: "FAILED", message: response.message });
      } else {
        return res.status(200).json({ status: "SUCCESS", data: docs });
      }
    })
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