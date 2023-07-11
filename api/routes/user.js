const base = 'user';
const { Readable } = require('stream');
const Joi = require('joi').extend(require('joi-date-extensions'));
const controller = require('../controllers')[base];

module.exports = [
  {
    method: 'POST',
    path: `/${base}/login`,
    config: {
      handler: controller.login,
      validate: {
        payload: {
          password: Joi.string().required(),
          phoneNumber: Joi.string().required(),
          token: Joi.string().allow(''),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/register`,
    config: {
      handler: controller.register,
      validate: {
        payload: {
          address: Joi.string().required(),
          dateOfBirth: Joi.date().format('DD-MM-YYYY').required(),
          email: Joi.string().email().required(),
          gender: Joi.string().required(),
          name: Joi.string().required(),
          nik: Joi.string().regex(/[0-9]{16}/).allow(''),
          password: Joi.string().required(),
          phoneNumber: Joi.string().required(),
          placeOfBirth: Joi.string().required(),
          token: Joi.string().allow(''),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/update`,
    config: {
      handler: controller.update,
      payload: {
        parse: true,
        output: 'stream',
        maxBytes: 3 * 1000 * 1000,
        allow: 'multipart/form-data',
      },
      validate: {
        payload: {
          address: Joi.string().allow(''),
          dateOfBirth: Joi.date().format('DD-MM-YYYY').allow(''),
          email: Joi.string().email().allow(''),
          gender: Joi.string().allow(''),
          name: Joi.string().allow(''),
          nik: Joi.string().regex(/[0-9]{16}/).allow(''),
          password: Joi.string().allow(''),
          phoneNumber: Joi.string().allow(''),
          photo: Joi.object().allow(null).type(Readable),
          placeOfBirth: Joi.string().allow(''),
          type: Joi.string().allow(''),
          token: Joi.string().allow(''),
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${base}/get/{user?}`,
    config: {
      handler: controller.get
    },
  },
  {
    method: 'GET',
    path: `/${base}/deletePhoto`,
    config: {
      handler: controller.delete
    },
  },
];