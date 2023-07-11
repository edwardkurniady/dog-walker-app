const base = 'breed';
const controller = require('../controllers')[base];

module.exports = [
  {
    method: 'GET',
    path: `/${base}`,
    config: {
      handler : controller.getList,
    },
  },
];