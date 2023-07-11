const Model = require('../models');

module.exports = async (model, data, checks = ['phoneNumber', 'email']) => {
  if (!Array.isArray(checks)) checks = [ checks ];
  for (let i = 0; i < checks.length; i++) {
    if (!data[checks[i]]) continue;
    const key = checks[i];
    const duplicate = await Model[model].findOne({
      where: { key: data[key] },
    });
    if (!duplicate) continue;

    return {
      key,
      duplicate,
    };
  }

  return {
    key: null,
    duplicate: null,
  };
};
