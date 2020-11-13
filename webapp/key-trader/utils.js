// async/await error catcher
const catchAsyncErrors = (fn) => (req, res, next) => {
  const routePromise = fn(req, res, next);
  if (routePromise.catch) {
    // console.log(req);
    // console.log('blahblahblah ');
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

exports.catchAsync = catchAsyncErrors;
exports.encodeWwwFormUrl = encodeWwwFormUrl;
