const path = require('path');
const root = path.resolve('.');
const Walker = require('./walker');
const Dog = require('./dog');
const Promise = require('bluebird');
const moment = require('moment-timezone');
const constants = require(`${root}/const`);
const { Op } = require('sequelize');
const { filter } = require(`${root}/utils`);
const {
  database,
  map,
  photo,
} = require('../services');

const dateFormat = 'HH:mm:ss DD-MM-YYYY';
const exclude = {
  attributes: {
    exclude:[
      'createdAt',
      'updatedAt',
    ],
  },
};

function inRange (value, start, end) {
  return (start < value) && (value < end);
}

async function processTrx (t, key = 'userId') {
  const map = {
    userId: 'walkerId',
    walkerId: 'userId',
  };
  const { address } = await database.findOne('User', { id: t.userId });
  const {
    name,
    phoneNumber,
    photo,
  } = await database.findOne('User', {
    id: t[map[key]],
  });
  t.clientId = t[map[key]];
  t.phoneNumber = key === 'userId' ? phoneNumber : (await database.findOne('User', {
    id: t.walkerId,
  })).phoneNumber;
  [
    'userId',
    'walkerId',
    // 'isRated',
    ...[
      'before',
      'after',
      'poop',
    ].map(type => `${type}Photo`),
  ].map(k => delete t[k]);
  return {
    ...t,
    name,
    address,
    photo,
    dogId: (await database.findOne('TransactionDetail', {
      transactionId: t.id,
    })).dogId,
  };
}

async function isAvailable (walkerId, walkDate, duration) {
  const start = moment(walkDate, dateFormat).valueOf();
  const end = moment(walkDate, dateFormat).add(duration, 'hours').valueOf();

  const schedules = await database.findAll('Schedule', { walkerId });
  let available = true;
  for (let i = 0; i < schedules.length; i++) {
    let { startTime, endTime } = schedules[i];
    startTime = moment(startTime, dateFormat).valueOf();
    endTime = moment(endTime, dateFormat).valueOf();
    available = available && !inRange(startTime, start, end);
    available = available && !inRange(endTime, start, end);
    available = available && !inRange(start, startTime, endTime);
    available = available && !inRange(end, startTime, endTime);
  }

  return available;
}

async function processStatus (status, trx, where) {
  if (!status) return;
  if (status === 'DONE') await database.delete('Schedule', where);
  if (status !== 'diterima') return;

  const m = moment(trx.walkDate, dateFormat);
  await database.create('Schedule', {
    walkerId: trx.walkerId,
    startTime: m.format(dateFormat),
    endTime: m.add(trx.duration + 0.5, 'hours').format(dateFormat),
    transactionId: where.transactionId,
  });
}

module.exports.findawalker = async (req, _) => {
  req.payload.userId = req.requester;
  req.payload.walkDate = moment(req.payload.walkDate).format(dateFormat);
  const user = await database.findOne('User', {
    id: req.requester,
  });
  // const dogs = await database.findAll('Dog', {
  //   id: { [Op.in]: req.payload.dogs },
  // });
  const dog = await database.findOne('Dog', { id: req.payload.dogId });
  // const heaviest = dogs.reduce((acc, curr) => {
  //   const accW = acc.weight;
  //   const currW = curr.weight;
  //   return accW > currW ? accW : currW;
  // }, { weight: 0 });

  const walkers = await database.findAll('Walker', {
    // maxDogSize: { [Op.gte]: heaviest },
    id: { [Op.ne]: req.requester },
    maxDogSize: { [Op.gte]: dog.weight },
    walkDuration: { [Op.gte]: req.payload.duration },
  }, exclude);
  
  const filteredWalkers = await Promise.all(walkers.map(async (walker) => {
    const w = await database.findOne('User', { id: walker.id }, exclude);
    const dist = await map.getDistance(w.address, user.address);
    const between = walker.travelDistance >= dist;
    const available = await isAvailable(w.id, req.payload.walkDate, req.payload.duration);

    return (between && available) ? {
      ...w,
      ...walker,
    } : null;
  }));

  return {
    ...constants['200'],
    body: filteredWalkers.filter(w => w),
  };
};

module.exports.order = async (req, _) => {
  req.payload.status = 'menunggu';
  req.payload.userId = req.requester;
  req.payload.walkDate = moment(req.payload.walkDate).format(dateFormat);
  req.payload.isRated = false;
  // const { dogs } = req.payload;
  // delete req.payload.dogs;

  const walker = await database.findOne('Walker', {
    id: req.payload.walkerId,
  });
  req.payload.price = walker.pricing * req.payload.duration;
  // req.payload.totalPrice = walker.pricing * dogs.length;
  const trx = (await database.create('Transaction', req.payload)).dataValues;
  // await Promise.all(dogs.map(async (dogId) => {
  //   await database.create('TransactionDetail', {
  //     dogId,
  //     transactionId: trx.id,
  //   });
  // }));
  await database.create('TransactionDetail', {
    dogId: req.payload.dogId,
    transactionId: trx.id,
  });

  return {
    ...constants['200'],
    body: {
      id: trx.id,
    },
  };
};

module.exports.isRated = async (req, _) => {
  const trx = await database.findAll('Transaction', {
    userId: req.requester,
    status: { [Op.in]: [ 'DONE' ] },
  });
  const m = (wd) => moment(wd, dateFormat).valueOf();

  const t = trx.sort((a, b) => m(b.walkDate) - m(a.walkDate));
  return {
    ...constants['200'],
    body: t.length > 0 ? await processTrx(t[0]) : null,
  };
};

module.exports.update = async (req, _) => {
  const trx = await database.findOne('Transaction', {
    id: req.payload.id,
  });
  if (!trx) return {
    ...constants['404'],
    message: 'Pesanan/ transaksi tidak ditemukan!',
  };
  if (trx.userId !== req.requester && trx.walkerId !== req.requester) return {
    ...constants['403'],
    message: 'Anda tidak memiliki izin yang tepat!',
  };

  const available = await isAvailable(trx.walkerId, trx.walkDate, trx.duration);
  if (req.payload.status === 'diterima' && !available) return {
    ...constants['409'],
    message: 'Walker sibuk disaat itu! Silahkan pilih walker lain',
  };

  await processStatus(req.payload.status, trx, {
    transactionId: req.payload.id,
  });

  await Promise.all(Object.keys(req.payload).map(async (key) => {
    if (!key.match(/Photo/gm)) return;
    req.payload[key] = await photo.upload(
      payload[key], 
      trx.id, 
      `transaction/${key.replace('Photo', '')}`,
    );
  }));

  filter(req.payload);
  await database.update('Transaction', req.payload, {
    id: trx.id,
  });

  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.status = async (req, _) => {
  const {
    status,
    transactionId,
  } = req.payload;

  const trx = await database.findOne('Transaction', { id: transactionId });
  if (!trx) return {
    ...constants['404'],
    message: 'Pesanan/ transaksi tidak ditemukan!',
  };
  if (trx.userId !== req.requester && trx.walkerId !== req.requester) return {
    ...constants['403'],
    message: 'Anda tidak memiliki izin yang tepat!',
  };

  const available = await isAvailable(trx.walkerId, trx.walkDate, trx.duration);
  if (req.payload.status === 'APPROVED' && !available) return {
    ...constants['409'],
    message: 'Walker sibuk disaat itu! Silahkan pilih walker lain',
  };
  await processStatus(status, trx, { transactionId });

  await database.update('Transaction', { status }, { id: transactionId });
  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.reject = async (req, _) => {
  const where = { id: req.params.trx };
  const t = await database.findOne('Transaction', where);
  if (t.walkerId !== req.requester) return {
    ...constants['403'],
    message: 'Anda tidak memiliki izin yang tepat!',
  };
  await database.delete('Transaction', where);

  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.get = async (req, _) => {
  const key = req.route.path.match(/\{(.*?)\?}/)[1];
  
  req.params[key] = req.params[key] || req.requester;
  const transactions = (await Promise.all(database.findAll('Transaction', {
    ...req.params,
    status: { [Op.not]: 'DONE' },
  }, exclude)).map(async (t) => {
    const wd = moment(t.walkDate, dateFormat);
    const walkDate = t.status === 'menunggu' ? wd : wd.add(t.duration, 'hours');
    const hasPassed = walkDate.valueOf() <= moment.tz('Asia/Jakarta').valueOf();
    if (hasPassed) await database.delete('Transaction', { id: t.id });
    return hasPassed ? null : t;
  })).filter(t => t);
  const trx = await Promise.all(transactions.map(async (t) => processTrx(t, key)));

  const order = [
    'berlangsung',
    'menunggu',
    'diterima',
  ];
  const m = (wd) => moment(wd, dateFormat).valueOf();

  return {
    ...constants['200'],
    body: trx.sort((a, b) => {
      const aIndex = order.indexOf(a.status);
      const bIndex = order.indexOf(b.status);
      if (aIndex > bIndex) return 1;
      if (aIndex < bIndex) return -1;
      return m(b.walkDate) - m(a.walkDate);
    }),
  };
};

module.exports.find = async (req, _) => {
  const trx = await database.findOne('Transaction', {
    id: req.params.id,
  }, exclude);

  return processTrx(trx);
  // const detail = await database.findOne('TransactionDetail', {
  //   transactionId: req.params.id,
  // });

  // const walker = trx.walkerId ? (await Walker.get({
  //   params: { walker: trx.walkerId },
  // })).body : null;

  // return {
  //   ...trx,
  //   walker,
  //   // dogs: await Promise.all(detail.map(async (dt) => {
  //   //   return (await Dog.find({
  //   //     params: { dog: dt.dogId },
  //   //   })).body;
  //   // })),
  //   dog: (await Dog.find({
  //     params: { dog: detail.dogId },
  //   })).body,
  // };
};
