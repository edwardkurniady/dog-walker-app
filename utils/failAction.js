module.exports = async (req, _, err) => {
  [
    'payload',
    'params',
    'query',
    'err',
  ].map(k => console.error(req[k]));
  throw err;
};