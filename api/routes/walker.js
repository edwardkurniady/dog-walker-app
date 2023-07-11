const base = 'walker';
const Joi = require('joi').extend(require('joi-date-extensions'));
const controller = require('../controllers')[base];

module.exports = [
  {
    method: 'POST',
    path: `/${base}/register`,
    config: {
      handler: controller.register,
      validate: {
        payload: {
          description: Joi.string().required(),
          maxDogSize: Joi.number().required(),
          pricing: Joi.number().required(),
          travelDistance: Joi.number().required(),
          walkDuration: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/update`,
    config: {
      handler: controller.update,
      validate: {
        payload: {
          description: Joi.string().allow(''),
          isVerified: Joi.boolean(),
          isRecommended: Joi.boolean(),
          maxDogSize: Joi.number(),
          pricing: Joi.number(),
          travelDistance: Joi.number(),
          walkDuration: Joi.number(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/rate`,
    config: {
      handler: controller.rate,
      validate: {
        payload: {
          id: Joi.number().required(),
          rate: Joi.number().required(),
          orderId: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${base}/get/{walker?}`,
    config: {
      handler: controller.get
    },
  },
];