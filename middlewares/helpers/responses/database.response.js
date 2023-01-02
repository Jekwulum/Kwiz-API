const errorCodes = require("../../enums/errorcodes.enums");

const databaseError = error => {
  const message = (error === null || typeof error === undefined) ? 'FAILURE, Internal Server Error' : error.errmsg;
  return { status: errorCodes.Error400.code, type: errorCodes.Error400.type, message };
}

module.exports = { databaseError };
