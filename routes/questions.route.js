const router = require('express').Router();
const TokenService = require('../middlewares/helpers/services/token.service');
const validator = require('../middlewares/helpers/services/validator.service');
const QuestionController = require('../controllers/questions.controller');

router.get('/',
  TokenService.verifyToken,
  (req, res) => QuestionController.get(req, res)
);

router.get('/:code',
  TokenService.verifyToken,
  (req, res) => QuestionController.getByCode(req, res)
);

router.get('/fetch-by-quizId/:quizId',
  // TokenService.verifyToken,
  (req, res) => QuestionController.getByQuizId(req, res)
);

router.get('/fetch-by-userId/:userId',
  TokenService.verifyToken,
  (req, res) => QuestionController.getByUserId(req, res)
);

router.post('/',
  TokenService.verifyToken,
  validator("questionValidators", "addQuestion"),
  (req, res) => QuestionController.create(req, res)
);

router.post('/player/:quizId',
  // TokenService.verifyToken,
  validator("questionValidators", "addPlayer"),
  (req, res) => QuestionController.addPlayer(req, res)
);

router.get('/player/:quizId',
  TokenService.verifyToken,
  (req, res) => QuestionController.getPlayersByQuizId(req, res)
);

router.get('/player/:quizId/:playerId',
  TokenService.verifyToken,
  (req, res) => QuestionController.getPlayerByQuizIdAndPlayerId(req, res)
);

router.patch('/player/update-score/:playerId/:quizId',
  // TokenService.verifyToken,
  (req, res) => QuestionController.updateScores(req, res)
);

module.exports = router;