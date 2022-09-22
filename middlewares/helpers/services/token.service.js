const config = process.env;
const jwt = require('jsonwebtoken');
const TokenModel = require('../../../models/token.model');

const tokenService = {
  generateToken: (userId, email, UsersRef) => {
    const token = jwt.sign({ userId, email }, config.TOKEN_KEY, { expiresIn: "2h" });
    TokenModel.create({ token, userId, UsersRef }, (err, doc) => {
      if (err) res.status(400).json({ status: "FAILED", message: err });
    });

    return token;
  },

  verifyToken: async (req, res, next) => {
    if (req.headers && req.header['authorization']) {
      const token = req.body.token || req.query.token || req.headers['Authorization'];

      try {
        tokenExists = await TokenModel.findOne({ token });
        if (!tokenExists) res.status(400).json({ status: "FAILED", message: "Invalid Token" });
        
        req.user = jwt.verify(token, config.TOKEN_KEY);
        console.log("req.user: ", req.user);
      } catch (error) {
        res.status(401).json({ status: "FAILED", message: "Invalid Token" });
      }

    } else res.status(404).json({ status: "FAILED", message: "Error occurred, validation token not found" });

    return next();
  }
};

module.exports = tokenService;