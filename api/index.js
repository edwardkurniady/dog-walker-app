const routes = require('./routes');

module.exports = {
  name: 'api',
  register: (server) => {
    routes.forEach((route) => server.route(route));
  },
};
