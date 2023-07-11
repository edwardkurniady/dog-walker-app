require('dotenv').config();

const defaultConfig = {
  username: 'localhost',
  password: 'taralite123',
  database: 'dudubase',
  host: 'localhost',
  dialect: 'postgres',
  timezone: '+07:00',
};

const configurations = {};
['development', 'test', 'production'].forEach(env => {
  const config = {};
  Object.keys(defaultConfig).forEach(key => {
    const k = `${env}_${key}`.toUpperCase();
    config[key] = process.env[`DB_${k}`] || defaultConfig[key];
  });
  configurations[env] = config;
});

module.exports = configurations;