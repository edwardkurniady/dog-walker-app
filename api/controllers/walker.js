const path = require('path');
const root = path.resolve('.');
const constants = require(`${root}/const`);
const { filter } = require(`${root}/utils`);
const { database } = require('../services');

const getDetails = async (id) => {
  const options = {
    attributes: {
      exclude:[
        'createdAt',
        'updatedAt',
      ],
    },
  };

  const walker = await database.findOne('Walker', { id }, options);
  if (!walker) return {
    ...constants['404'],
    message: 'walker tidak ditemukan!',
  };
  const usr = await database.findOne('User', { id }, options);
  return {
    ...constants['200'],
    body: {
      ...usr,
      ...walker,
    },
  };
};

module.exports.register = async (req, _) => {
  req.payload.id = req.requester;
  req.payload.isRecommended = false;
  req.payload.isVerified = false;
  req.payload.rating = 0;
  req.payload.raters = 0;
  filter(req.payload);

  await database.create('Walker', req.payload);
  await database.update(
    'User',
    { isWalker: true },
    { id: req.payload.id }
  );

  return getDetails(req.payload.id);
};

module.exports.update = async (req, _) => {
  req.payload.id = req.requester;
  filter(req.payload);
  await database.update('Walker', req.payload, { id: req.payload.id });
  
  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.get = async (req, _) => {
  return getDetails(req.params.walker || req.requester);
};

module.exports.rate = async (req, _) => {
  const where = { id: req.payload.id };
  const w = await database.findOne('Walker', where, {
    attributes: {
      exclude:[
        'createdAt',
        'updatedAt',
      ],
    },
  });
  if (!w) return {
    ...constants['404'],
    message: 'walker tidak ditemukan!',
  };

  w.raters = w.raters + 1;
  w.rating = w.rating + req.payload.rate;

  await database.update('Walker', w, where);
  await database.update('Transaction', {
    isRated: true,
  }, { id: req.payload.orderId });
  return {
    ...constants['200'],
    body: null,
  };
};
