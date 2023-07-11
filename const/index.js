const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);
const constant = {};

fs.readdirSync(__dirname)
  .filter((file) => 
    file.indexOf('.') !== 0 && 
    file !== basename &&
    ['txt', 'json'].reduce((bool, k) =>
      bool || file.slice(file.indexOf('.') + 1) === k
    , false)) 
  .forEach((file) => {
      const name = file.slice(0, file.indexOf('.'));
      const type = file.slice(file.indexOf('.') + 1);
      constant[name] = fs.readFileSync(`./const/${file}`);
      if (type === 'json') constant[name] = JSON.parse(constant[name]);
      if (type === 'txt') constant[name] = constant[name].toString();
  });

module.exports = constant;
