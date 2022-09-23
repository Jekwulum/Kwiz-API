const config = process.env;
const router = require('express').Router();
const TokenService = require('../middlewares/helpers/services/token.service');
const AuthController = require('../controllers/auth.controller');
const validator = require('../middlewares/helpers/services/validator.service');

router.post('/login',
  validator("authValidators", "login"),
  (req, res) => AuthController.login(req, res)
);

router.post('/logout',
  (req, res) => AuthController.logout(req, res)
);

module.exports = router;