const { BadRequestError, getErrorType } = require("./backend/errorUtil");

// async/await error catcher
const catchAsyncErrors = (fn) => (req, res, next) => {
  const routePromise = fn(req, res, next);
  if (routePromise.catch) {
    console.log("Error handled through catchAsyncErrors");
    routePromise.catch((err) => next(err));
  }
};

function encodeWwwFormUrl(  obj  ) {
  let string = '';

  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;
    string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }

  return string.substring(1);
}

class RequiredParam {
   constructor(fieldName, fieldType = undefined) {
     this.fieldName = fieldName;
     this.fieldType = fieldType;
   }
}

function checkRequestQueryParams(req, requiredParams, nextCb) {
  return checkFields(req.query, requiredParams, nextCb);
}

function checkRequestBodyFields(req, requiredFields, nextCb) {
  return checkFields(req.body, requiredFields, nextCb);
}

function checkResponse(response, jsonBody, errorMsg, requiredFields, nextCb) {
  const errorType = getErrorType(response.status);
  if (errorType)
  {
    nextCb(errorType(errorMsg, jsonBody)); // response.body will pass the response
    return true;
  }
  return checkFields(jsonBody, requiredFields, nextCb);
}

function checkResponseArray(response, jsonArray, errorMsg, requiredFields, nextCb) {
  const errorType = getErrorType(response.status);
  if (errorType)
  {
    nextCb(new errorType(errorMsg, jsonBody)); // response.body will pass the response
  }
  for (const arrItem of jsonArray) {
    if (checkFields(arrItem, requiredFields, nextCb)) {
      return true;
    }
  }
  return false;
}

function checkFields(listOfValues, requiredParams, nextCb) {
  let errors = [];
  for (const requiredParam of requiredParams) {
    const fieldName = requiredParam.fieldName;
    const fieldType = requiredParam.fieldType;
    if (listOfValues[fieldName]) {
      // relying on shortciruit bool eval to avoid rhs instanceof undefined
      if (fieldType !== undefined && listOfValues[fieldName] instanceof fieldType) {
        errors.push(`Incorrect type for ${fieldName} expected ${typeof(fieldType)}`)
      }
    }
    else {
      errors.push(`Missing ${fieldName}`);
    }
  }
  if (errors.length == 0) {
    return false;
  }
  nextCb(new BadRequestError("Request missing fields", {err: JSON.stringify(errors)}));
  return true;
}

exports.catchAsync = catchAsyncErrors;
exports.encodeWwwFormUrl = encodeWwwFormUrl;
exports.checkRequestQueryParams = checkRequestQueryParams;
exports.checkRequestBodyFields = checkRequestBodyFields;
exports.RequiredParam = RequiredParam;
exports.checkResponse = checkResponse;
exports.checkResponseArray = checkResponseArray;
