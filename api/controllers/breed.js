const path = require('path');
const { database } = require('../services');
const constants = require(path.resolve('.', 'const'));

module.exports.getList = async (req, h) => {
  return {
    ...constants['200'],
    body: await database.findAll('Breed', null, {
      attributes: {
        exclude:[
          'createdAt',
          'updatedAt',
        ],
      },
    }),
  };
};
