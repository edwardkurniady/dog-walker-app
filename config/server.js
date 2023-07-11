module.exports = {
  host: process.env.SERVER_HOST,
  port: process.env.SERVER_PORT,
  routes: { cors: true },
  router: { stripTrailingSlash: true },
};
