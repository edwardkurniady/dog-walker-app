const fs = require('fs');
const path = require('path');
const root = path.resolve('.');
const Bounce = require('bounce');
const constants = require(`${root}/const`);
const {
  auth,
  failAction,
} = require(`${root}/utils`);

const basename = path.basename(module.filename);

const routes = [];
const noAuth = {
  breed: [ 'breed' ],
  user: [
    'login',
    'register',
  ],
  firebase: [ 
    'fmb'
  ],
};

fs.readdirSync(__dirname)
  .filter((file) => 
    file.indexOf('.') !== 0
    && file !== basename
    && file.slice(-3) === '.js')
  .forEach((file) => {
    const name = file.slice(0, -3);
    routes.push(...require(`./${name}`).map(route => {
      const fn = route.config.handler;
      route.config.validate = {
        failAction,
        ...route.config.validate,
      };
      
      route.config.handler = async (req, h) => {
        try {
          let needAuth = true;
          (noAuth[name] || []).forEach(na => {
            if (route.path.indexOf(na) > -1) needAuth = false;
          });

          const session = auth.verify(req.headers.session);
          if (needAuth && session.error) return {
            ...constants['401'],
            message: session.error,
          };

          req.requester = session.userId;
          return fn(req, h);
        } catch(e) {
          console.error(e);
          Bounce.rethrow(e, 'boom');
          Bounce.rethrow(e, 'system');
        }
      }
      return route;
    }));
  });

module.exports = routes;
