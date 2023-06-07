const { generateCode } = require('../middlewares/utils/code_generator');
const { generateStats } = require('../middlewares/utils/statsGenerator');
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

  getQuizTitles: async (req, res) => {
    console.log("here");
    const data = await QuizTitlesModel.find();
    res.status(200).json({ status: "SUCCESS", message: "Successfully fetched all data", data });
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
            return res.status(201).json({ status: "SUCCESS", message: "Quiz added", data });
          }
        });
      }
    });
  },

  addPlayer: async (req, res) => {
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
      } else if (!docs) {
        return res.status(404).json({ status: "FAILED", message: "Player not found" });
      }
      else {
        return res.status(200).json({ status: "SUCCESS", data: docs });
      }
    })
  },

  updateScores: async (req, res) => {
    let { playerId, quizId } = req.params;
    let { score } = req.body;
    // let playerScore = 0;
    PlayersModel.findOne({ playerId, quizId }, (err, playerDoc) => {
      if (err || !playerDoc) res.status(404).json({ message: "Record not found", status: "FAILED" })
      else {
        QuestionModel.find({ quizId }, (err, docs) => {
          if (err || !docs) res.status(404).json({ message: "Records not found", status: "FAILED" })
          else {
            // for (let quizPayloadObj of quizPayload) {
            //   for (let docsObj of docs) {
            //     if (quizPayloadObj.code === docsObj.code) {
            //       if (quizPayloadObj.answer.toLowerCase() === docsObj.answer.toLowerCase()) {
            //         playerDoc.score += docsObj.points;
            //       }
            //       playerScore = playerDoc.score;
            //     }
            //   }
            // }

            PlayersModel.updateOne({ playerId, quizId }, { score }, (err) => {
              if (err) res.status(400).json({ status: "FAILED", message: err })
              else return res.status(200).json({ status: "SUCCESS", message: "Player Score successfully updated" });
            });

          }
        });
      }
    });
  },

  stats: async (req, res) => {
    QuestionModel.find({ userId: req.user.userId }, (err, questionsResults) => {
      if (err || !questionsResults) res.status(400).json({ message: "No questions records found", status: "FAILED" })
      else {
        QuizTitlesModel.find((err, titlesResults) => {
          if (err || !titlesResults) res.status(400).json({ message: "No titles records found", status: "FAILED" })
          else {
            PlayersModel.find((err, playersResults) => {
              if (err || !playersResults) res.status(400).json({ message: "No players records found", status: "FAILED" })
              else {
                const [questions, titles, players] = generateStats(questionsResults, titlesResults, playersResults);
                res.status(200).json({ status: "SUCCESS", message: "fetched stats", data: { questions, titles, players } });
              }
            })
          }
        })
      }
    });
  }
};

module.exports = QuestionController;