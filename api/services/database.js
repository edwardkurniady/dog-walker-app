const path = require('path');
const root = path.resolve('.');
const Model = require(`${root}/models`);
const moment = require('moment-timezone');
const { crypt } = require(`${root}/utils`);

function processDate (data, model, options) {
  // if (!data) return consistent(data, model, options);
  if (!data) return data;
  const isArray = Array.isArray(data);
  data = isArray ? data : [ data ];

  const result = data.map(d => {
    if (d.dateOfBirth) d.dateOfBirth = moment(d.dateOfBirth, 'YYYY-MM-DD').format('DD-MM-YYYY');
    if (!d.createdAt) return consistent(d, model, options);
    // if (d.photo) d.photo = crypt.decrypt(d.photo);
    d.createdAt = moment(d.createdAt).tz('Asia/Jakarta').format('HH:mm:ss DD-MM-YYYY');
    return consistent(d, model, options);
  });

  return isArray ? result : result[0];
}

function consistent (data, model, options) {
  const opt = options ? options.exclude || [] : [];
  const notShow = {
    User: [
      'token',
      'latlng',
    ],
  };

  const newData = {};
  Object.keys(Model[model].rawAttributes).forEach(key => {
    if (opt.indexOf(key) > -1) return;
    if (notShow[model] && notShow[model].indexOf(key) > -1) return;
    newData[key] = data ? data[key] : null;
  });
  return newData;
}

module.exports.findOne = async (model, where, options = {}) => {
  const data = await Model[model].findOne({
    where,
    ...options,
    raw: true,
  });

  return processDate(data, model, options.attributes);
};

module.exports.findAll = async (model, where, options = {}) => {
  const data = await Model[model].findAll({
    where,
    ...options,
    raw: true,
  });

  return processDate(data, model, options.attributes);
};

module.exports.create = async (model, data) => {
  return Model[model].create(data);
};

module.exports.update = async (model, data, where) => {
  await Model[model].update(data, { where });
};

module.exports.delete = async (model, where) => {
  await Model[model].destroy({ where });
};

module.exports.count = async (model, where) => {
  return Model[model].count({ where });
};

module.exports.dupCheck = async (model, data, checks = ['phoneNumber', 'email']) => {
  if (!Array.isArray(checks)) checks = [ checks ];
  for (let i = 0; i < checks.length; i++) {
    if (!data[checks[i]]) continue;
    const key = checks[i];
    const duplicate = await this.findOne(model, {
      [key]: data[key],
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
