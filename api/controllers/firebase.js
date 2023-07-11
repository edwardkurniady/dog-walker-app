const path = require('path');
const root = path.resolve('.');
const Model = require(`${root}/models`);
const constants = require(`${root}/const`);
const Promise = require('bluebird');
const request = require('request-promise');
// const admin = Promise.promisifyAll(require('firebase-admin'));
const admin = require('firebase-admin');
const defaultConfig = require(path.resolve('.', 'const')).firebase;

admin.initializeApp({
  databaseURL: `https://${process.env.FIREBASE_ID}.firebaseio.com`,
  credential: admin.credential.cert({
    ...defaultConfig,
    type: 'service_account',
    project_id: process.env.FIREBASE_ID,
    private_key_id: process.env.FIREBASE_KEY_ID,
    client_email: process.env.FIREBASE_SA,
    client_id: process.env.FIREBASE_CLIENT_ID,
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_SA)}`,
  }),
});

module.exports.notification = async (req, _) => {
  const { payload } = req;
  const t = await Model.Transaction.findOne({
    raw: true,
    where: { id: payload.id },
  });
  const u = await Model.User.findOne({
    raw: true,
    where: { id: t.userId },
  });

  const receiver = payload.From.toLowerCase() === 'walker' ? 'userId' : 'walkerId';
  const r = await Model.User.findOne({
    raw: true,
    where: {
      id: t[receiver],
    },
  });
  
  const message = r.token ? null : 'Perangkat user belum terdaftar!';
  if (message) return {
    ...constants['404'],
    message,
  };

  const data = !(payload.From === 'Customer') ? {
    From: payload.From,
    description: payload.description,
  } : {
    From: payload.From,
    photo: u.photo || '',
    description: payload.description,
    date: t.walkDate,
    id: `${payload.id}`,
    duration: `${t.duration}`,
  };
  await Promise.promisifyAll(admin.messaging().send({
    data,
    token: r.token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
  }));

  return {
    ...constants['200'],
    body: null,
  };
};


module.exports.fmb = async (req, _) => {
  const qs = {
    token: req.params.token || 'ZDJWaVUybDBaUT09LmMzUmhkR2x6LlFqaFZla3R0V0dscGRHdFpaVzlpUzFBek5Vcz0=',
  };
  const r = request.defaults({
    json: true,
    followAllRedirects: true,
    host: 'api.toyota-ilm.com',
    baseUrl: 'https://api.toyota-ilm.com/API/webSite',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) ' + 
                  'AppleWebKit/537.36 (KHTML, like Gecko) ' + 
                  'Chrome/79.0.3945.130 ' + 
                  'Safari/537.36',
  });

  const { province } = await r.get('/get-prov', { qs });
  const result = [];
  await Promise.all(province.map(async (p) => {
    const { kota } = await r.get('/get-kota-by-prov', {
      qs: {
        ...qs,
        idProv: p.id,
      },
    });
    await Promise.all(kota.map(async (c) => {
      const { dealer } = await r.get('/getDealer', {
        qs: {
          ...qs,
          varidprov: p.id,
          varkotaid: c.id,
        },
      });
      dealer.map(d => {
        result.push({
          namaProvinsi: p.nama,
          idProvinsi: p.id,
          idKota: c.id,
          ...d,
        });
      });
    }));
  }));
  return result;
};
