const path = require('path');
const constants = require(path.resolve('.', 'const'));

module.exports = [
  {
    method: '*',
    path: '/{p*}',
    config: {
      auth: false,
      handler: (req, h) => {
        return {
          ...constants['404'],
          message: 'Page not found!',
        };
      },
    },
  },
];
