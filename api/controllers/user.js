const path = require('path');
const root = path.resolve('.');
const jwt = require('jsonwebtoken');
const constants = require(`${root}/const`);
const {
  database,
  photo,
} = require('../services');
const {
  filter,
  processCred,
} = require(`${root}/utils`);

const getDetails = async (id) => {
  return {
    ...constants['200'],
    body: await database.findOne('User', { id }, {
      attributes: {
        exclude:[
          'latlng',
          'createdAt',
          'updatedAt',
        ],
      },
    }),
  };
};

module.exports.login = async (req, _) => {
  const payload = processCred(req.payload);
  const errResp = {
    message: null,
    ...constants['401'],
  };
  const options = {
    attributes: {
      exclude:[
        'createdAt',
        'updatedAt',
      ],
    },
  };

  const where = { phoneNumber: payload.phoneNumber };
  const usr = await database.findOne('User', where, options);

  errResp.message = !usr ?
    'Nomor telepon belum terdaftar!' : 
    usr.password != payload.password ?
      'Password salah!' :
      null;

  if (errResp.message) return errResp;

  if (payload.token) await database.update('User', {
    token: payload.token,
  }, where);

  return {
    ...constants['200'],
    session: jwt.sign({
      userId: usr.id,
    }, process.env.JWT_KEY),
    body: usr,
  };
};

module.exports.register = async (req, _) => {
  const payload = processCred(req.payload);
  const {
    key,
    duplicate,
  } = await database.dupCheck('User', payload);

  if (duplicate) return {
    ...constants['409'],
    message: `${key} telah terdaftar!`,
  };
  
  payload.photo = await photo.upload(
    payload.photo,
    payload.phoneNumber,
    'user/profile'
  );
  filter(payload);

  payload.isWalker = false;
  payload.type = 'customer';

  await database.create('User', payload);
  
  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.update = async (req, _) => {
  const payload = processCred(req.payload);
  payload.id = req.requester;
  const where = { id: payload.id };
  const user = await database.findOne('User', where);
  const {
    key,
    duplicate,
  } = await database.dupCheck('User', payload);
  const isUserData = duplicate ? (duplicate.id === payload.id) : false;

  if (duplicate && !isUserData) return {
    ...constants['409'],
    message: `${key} telah terdaftar!`,
  };

  payload.photo = await photo.upload(
    payload.photo,
    user.phoneNumber,
    'user/profile',
  );
  filter(payload);
  if (payload.photo) await database.update('User', {
    photo: payload.photo,
  }, where);

  const u = await database.findOne('User', where);
  const movePhoto = u.photo && (payload.phoneNumber !== u.phoneNumber);
  if (movePhoto) payload.photo = await photo.update(
    'user/profile',
    u.phoneNumber,
    payload.phoneNumber,
  );
  filter(payload);
  
  await database.update('User', payload, where);
  
  return getDetails(payload.id);
};

module.exports.get = async (req, _) => {
  return getDetails(req.params.user || req.requester);
};

module.exports.delete = async (req, _) => {
  const where = { id: req.requester };
  const u = await database.findOne('User', where);
  await photo.delete(u.phoneNumber, 'user/profile');
  await database.update('User', { photo: null }, where);
  return getDetails(u.id);
};
