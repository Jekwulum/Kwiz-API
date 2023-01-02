const errorCodes = require("../../enums/errorcodes.enums");

const validationError = error => {
  let errors = {};

  Object.keys(error.errors).forEach((key) => {
    errors[key] = error.errors[key].message;
  });
  return errors;
};

const databaseError = error => {


  const message = (error === null || typeof error === undefined)
    ? 'FAILURE, Internal Server Error' : (error.name === "ValidationError")
      ? validationError(error) : error.errmsg;
  return { status: errorCodes.Error400.code, type: errorCodes.Error400.type, message };
}

module.exports = { databaseError };
