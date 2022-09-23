const router = require('express').Router();
const TokenService = require('../middlewares/helpers/services/token.service');
const validator = require('../middlewares/helpers/services/validator.service');
const QuestionController = require('../controllers/questions.controller');

router.get('/',
  TokenService.verifyToken,
  (req, res) => QuestionController.get(req, res)
);

router.post('/',
  TokenService.verifyToken,
  validator("questionValidators", "addQuestion"),
  (req, res) => QuestionController.create(req, res)
);

module.exports = router;