const base = 'dog';
const { Readable } = require('stream');
const controller = require('../controllers')[base];
const Joi = require('joi').extend(require('joi-date-extensions'));

module.exports = [
  {
    method: 'GET',
    path: `/${base}/get/{user?}`,
    config: {
      handler : controller.get,
    },
  },
  {
    method: 'POST',
    path: `/${base}/register`,
    config: {
      handler: controller.register,
      payload: {
        parse: true,
        output: 'stream',
        maxBytes: 5 * 1000 * 1000,
        allow: 'multipart/form-data',
      },
      validate: {
        payload: {
          age: Joi.number().required(),
          breedId: Joi.number().required(),
          gender: Joi.string().required(),
          name: Joi.string().required(),
          photo: Joi.object().allow(null).type(Readable),
          specialNeeds: Joi.string().allow(''),
          weight: Joi.number().required(),
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
        maxBytes: 5 * 1000 * 1000,
        allow: 'multipart/form-data',
      },
      validate: {
        payload: {
          age: Joi.number(),
          breedId: Joi.number(),
          gender: Joi.string().allow(''),
          id: Joi.number().required(),
          name: Joi.string().allow(''),
          photo: Joi.object().allow(null).type(Readable),
          specialNeeds: Joi.string().allow(''),
          weight: Joi.number(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/delete`,
    config: {
      handler: controller.delete,
      validate: {
        payload: {
          id: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/deletePhoto`,
    config: {
      handler: controller.deletePhoto,
      validate: {
        payload: {
          id: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${base}/find/{dog}`,
    config: {
      handler: controller.find,
    },
  },
];