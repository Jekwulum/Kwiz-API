const errorCodes = {
  Error400: {code: 400, type: 'Bad Request'},
  Error401: {code: 401, type: 'Unauthorised'},
  Error403: {code: 403, type: 'Forbidden'},
  Error404: {code: 404, type: 'Not Found'},
  Error405: {code: 405, type: 'Method Not Allowed'},
  Error500: {code: 500, type: 'Internal Server Error'},
  Error501: {code: 501, type: 'Not Implemented'},
}

module.exports = errorCodes;
