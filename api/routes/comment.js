const base = 'comment';
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
          comment: Joi.string().required(),
          postId: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/update`,
    config: {
      handler : controller.update,
      validate: {
        payload: {
          comment: Joi.string().required(),
          id: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'POST',
    path: `/${base}/delete`,
    config: {
      handler : controller.delete,
      validate: {
        payload: {
          id: Joi.number().required(),
        },
      },
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
    path: `/${base}/getList/{post}`,
    config: {
      handler : controller.getList,
    },
  },
  {
    method: 'GET',
    path: `/${base}/find/{comment}`,
    config: {
      handler : controller.find,
    },
  },
];
