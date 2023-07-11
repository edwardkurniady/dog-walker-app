const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);
const config = {};

fs.readdirSync(__dirname)
  .filter((file) => 
    file.indexOf('.') !== 0 && 
    file !== basename &&
    ['json', 'js'].reduce((bool, k) =>
      bool || file.slice(file.indexOf('.') + 1) === k
    , false)) 
  .forEach((file) => {
      const name = file.slice(0, file.indexOf('.'));
      config[name] = require(`./${name}`);
  });

module.exports = config;
