require('dotenv').config();
const request = require('request-promise');
const req = request.defaults({
  json: true,
  followAllRedirects: true,
  baseUrl: 'https://maps.googleapis.com/maps/api',
});
const key = process.env.API_KEY;

module.exports.getLatLng = async (address) => {
  const resp = await req.get('/place/findplacefromtext/json', {
    qs: {
      key,
      input: address,
      inputtype: 'textquery',
    },
  });

  const places = await Promise.all(resp.candidates.map(async (c) => {
    return req.get('/place/details/json', {
      qs: {
        key,
        place_id: c.place_id,
      },
    });
  }));

  const geo = places[0].result.geometry.location;

  return `${geo.lat},${geo.lng}`;
};

module.exports.getDistance = async (origins, destinations) => {
  const resp = (await req.get('/distancematrix/json', {
    qs: {
      key,
      origins,
      destinations,
    },
  })).rows[0].elements[0];
  
  if (resp.status === 'OK') return resp.distance.value/1000;
  return 99999999;
  // const resp2 = (await req.get('/distancematrix/json', {
  //   qs: {
  //     key,
  //     origins: await this.getLatLng(origins),
  //     destinations: await this.getLatLng(destinations),
  //   },
  // })).rows[0].elements[0];

  // return round(resp2.distance.value);
};
