const config = process.env;
const router = require('express').router();
const TokenService = require('../middlewares/helpers/services/token.service');
const UserController = require('../controllers/user.controller');
const validator = require('../middlewares/helpers/services/validator.service');

router.post('/',
  TokenService.verifyToken,
  validator("authValidators", "createUser"),
  (req, res) => UserController.createUser(req, res)
);

module.exports = router;