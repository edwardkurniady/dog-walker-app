const base = 'transaction';
const { Readable } = require('stream');
const Joi = require('joi').extend(require('joi-date-extensions'));
const controller = require('../controllers')[base];

module.exports = [
  {
    method: 'POST',
    path: `/${base}/findawalker`,
    config: {
      handler : controller.findawalker,
      validate: {
        payload: {
          // dogs: Joi.array().items(Joi.number()).required(),
          dogId: Joi.number().required(),
          duration: Joi.number().required(),
          walkDate: Joi.date().format('HH:mm:ss DD-MM-YYYY').required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/update`,
    config: {
      handler : controller.update,
      payload: {
        parse: true,
        output: 'stream',
        maxBytes: 3 * 1000 * 1000,
        allow: 'multipart/form-data',
      },
      validate: {
        payload: {
          afterPhoto: Joi.object().allow(null).type(Readable),
          beforePhoto: Joi.object().allow(null).type(Readable),
          // distance: Joi.number().allow(null),
          poopPhoto: Joi.object().allow(null).type(Readable),
          status: Joi.string().valid('diterima', 'berlangsung', 'DONE', ''),
          id: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/order`,
    config: {
      handler : controller.order,
      validate: {
        payload: {
          // dogs: Joi.array().items(Joi.number()).required(),
          dogId: Joi.number().required(),
          duration: Joi.number().required(),
          walkDate: Joi.date().format('HH:mm:ss DD-MM-YYYY').required(),
          walkerId: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/status`,
    config: {
      handler : controller.status,
      validate: {
        payload: {
          transactionId: Joi.number().required(),
          status: Joi.string().valid('diterima', 'berlangsung', 'DONE').required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${base}/isRated`,
    config: {
      handler : controller.isRated,
    },
  },
  {
    method: 'GET',
    path: `/${base}/reject/{trx}`,
    config: {
      handler : controller.reject,
    },
  },
  {
    method: 'GET',
    path: `/${base}/get/user/{userId?}`,
    config: {
      handler : controller.get,
    },
  },
  {
    method: 'GET',
    path: `/${base}/get/walker/{walkerId?}`,
    config: {
      handler : controller.get,
    },
  },
  {
    method: 'GET',
    path: `/${base}/find/{id}`,
    config: {
      handler : controller.find,
    },
  },
];