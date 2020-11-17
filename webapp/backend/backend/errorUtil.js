class GeneralError extends Error
{
  constructor(message, err)
  {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.err = err;
    Error.captureStackTrace(this, this.constructor);
  }


  getCode()
  {
    if(this instanceof BadRequestError)
    {
      return 400;
    }
    if(this instanceof ForbiddenError)
    {
      return 403;
    }
    if(this instanceof NotFoundError)
    {
      return 404;
    }
    if (this instanceof InternalServerError)
    {
      return 500;
    }

    return 500;

  }

}

class BadRequestError extends GeneralError{}
class ForbiddenError extends GeneralError{}
class NotFoundError extends GeneralError{}
class InternalServerError extends GeneralError{}

const getErrorType = (statuscode) => {
  if (String(statuscode).startsWith('2') ||
      String(statuscode).startsWith('3')) {
    // if status code is 2xx or 3xx it is not an error
    return undefined;
  }
  // Handle specific error types here
  switch (statuscode)
  {
    case 403:
      return ForbiddenError;

    case 404:
      return NotFoundError;
  }

  // catch any other 4xx not handled above
  if (String(statuscode).startsWith(4)) {
    return BadRequestError;
  }

  // Any status code that wasn't handled above should be handled as a general 500
  return InternalServerError;
}

module.exports =
{
  GeneralError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
  getErrorType
};
