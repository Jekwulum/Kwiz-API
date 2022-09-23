const authValidators = require('../validators/auth.validator');
const createError = require('http-errors');
const questionsValidator = require('../validators/question.validator');

module.exports = (validatorType, method) => {
  const validator = getValidator(validatorType, method);
  if (typeof validator === "undefined")
    throw new Error(`'${validator}' validator does not exist`);

  return async (req, res, next) => {
    try {
      req.body = await validator.validateAsync(req.body);
      next();
    } catch (error) {
      if (error.isJoi) {
        const response = {
          status: 400, type: "FAILED",
          message: `Required field missing: ${error.details[0].message}..`
        };
        return res.status(response.status).json({ status: response.type, message: response.message });
      }
      next(createError(500));
    };
  };
};

const getValidator = (validatorType, method) => {
  if (validatorType === "authValidators") return authValidators[method];
  if (validatorType === 'questionValidators') return questionsValidator[method];
};