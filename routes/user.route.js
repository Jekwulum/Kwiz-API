const express = require('express')
const router = express.Router();
const TokenService = require('../middlewares/helpers/services/token.service');
const UserController = require('../controllers/user.controller');
const validator = require('../middlewares/helpers/services/validator.service');

router.post("/",
  TokenService.verifyToken,
  validator("authValidators", "createUser"),
  (req, res) => UserController.createUser(req, res)
);

router.get("/email/:email",
  TokenService.verifyToken,
  (req, res) => UserController.getByEmail(req, res)
);

router.get("/:id",
  TokenService.verifyToken,
  (req, res) => UserController.getById(req, res)
);

router.get("/",
  TokenService.verifyToken,
  (req, res) => UserController.get(req, res)
);

router.delete("/:id",
  TokenService.verifyToken,
  (req, res) => UserController.delete(req, res)
);

module.exports = router;