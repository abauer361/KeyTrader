const { GeneralError } = require('../backend/errorUtil');


const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
      errObject:err.err // populated if we have an error
    });
  }

  // handle Errors that are not general Errors
  return res.status(500).json({
    status: 'Non General Error',
    message: err.message,
    err: err
  });
}

module.exports = handleErrors;
