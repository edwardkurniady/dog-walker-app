const base = 'post';
const Joi = require('joi').extend(require('joi-date-extensions'));
const controller = require('../controllers')[base];

module.exports = [
  {
    method: 'POST',
    path: `/${base}/upload`,
    config: {
      handler : controller.upload,
      validate: {
        payload: {
          content: Joi.string().required(),
          title: Joi.string().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/update/{post}`,
    config: {
      handler : controller.update,
      validate: {
        payload: {
          content: Joi.string().allow(''),
          title: Joi.string().allow(''),
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${base}/delete/{post}`,
    config: {
      handler : controller.delete,
    },
  },
  {
    method: 'POST',
    path: `/${base}/like`,
    config: {
      handler : controller.like,
      validate: {
        payload: {
          id: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: `/${base}/get/{user?}`,
    config: {
      handler : controller.get,
    },
  },
  {
    method: 'GET',
    path: `/${base}/find/{post}`,
    config: {
      handler : controller.find,
    },
  },
  {
    method: 'GET',
    path: `/${base}/global`,
    config: {
      handler : controller.global,
    },
  },
];