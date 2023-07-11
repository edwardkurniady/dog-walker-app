const jwt = require('jsonwebtoken');

module.exports.refresh = (session) => {
  [
    'iat',
    'exp',
    'nbf',
    'jti',
  ].forEach(key => delete session[key]);
  return jwt.sign(session, process.env.JWT_KEY);
};

module.exports.verify = (session) => {
  try {
    return jwt.verify(session, process.env.JWT_KEY);
  } catch(e) {
    if (e.name === 'TokenExpiredError')
      return { error: 'Login Session Expired!' };
    if (e.message.indexOf('provided') > -1)
      return { error: 'Please login first!' };
    if (e.message === 'invalid signature')
      return { error: 'Invalid signature!' };
    throw e;
  }
};