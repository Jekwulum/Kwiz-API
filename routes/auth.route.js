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

router.post('/reset-password',
  TokenService.verifyToken,
  validator("authValidators", "resetPassword"),
  AuthController.changePassword
);

router.post('/forgot-password',
  validator("authValidators", "forgotPassword"),
  AuthController.forgotPasswordLink
);

router.get('/reset-forgot-password/:resetCode',
  AuthController.resetPassword
);

module.exports = router;