const path = require('path');
const root = path.resolve('.');
const Promise = require('bluebird');
const constants = require(`${root}/const`);
const {
  filter,
} = require(`${root}/utils`);
const {
  database,
  photo,
} = require('../services');

async function getBreedName (dogs = []) {
  if (!dogs) return dogs;
  const isArray = Array.isArray(dogs);
  dogs = isArray ? dogs : [ dogs ];

  const result = await Promise.all(dogs.map(async (dog) => {
    const breed = await database.findOne('Breed', { id: dog.breedId });
    dog.breedName = breed.name;
    delete dog.createdAt;
    delete dog.updatedAt;
    delete dog.ownerId;
    return dog;
  }));

  return isArray ? result : result[0];
}

module.exports.register = async (req, _) => {
  req.payload.ownerId = req.requester;
  filter(req.payload);
  const p = req.payload.photo;
  delete req.payload.photo;

  const dog = await database.create('Dog', req.payload);

  if (p) await database.update('Dog', {
    photo: await photo.upload(p, dog.id, 'dog/profile')
  }, { id: dog.id });

  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.get = async (req, _) => {
  const dogs = await database.findAll('Dog', {
    ownerId: req.params.user || req.requester,
  }, req.query);

  return {
    ...constants['200'],
    body: await getBreedName(dogs),
  };
};

module.exports.update = async (req, _) => {
  const ownerId = req.requester;
  const where = { id: req.payload.id };
  const doggo = await database.findOne('Dog', where);
  if (doggo.ownerId !== ownerId) return {
    ...constants['403'],
    message: 'Anda tidak memiliki izin yang tepat!',
  };
  req.payload.photo = await photo.upload(
    req.payload.photo,
    req.payload.id,
    'dog/profile',
  );
  filter(req.payload);
  await database.update('Dog', req.payload, where);

  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.find = async (req, _) => {
  const dog = await database.findOne('Dog', {
    id: req.params.dog,
  });
  
  return {
    ...constants['200'],
    body: await getBreedName(dog),
  };
};

module.exports.delete = async (req, _) => {
  const where = { id: req.payload.id };
  const doggo = await database.findOne('Dog', where);
  if (doggo.ownerId !== req.requester) return {
    ...constants['403'],
    message: 'Anda tidak memiliki izin yang tepat!',
  };

  await photo.delete(req.payload.id, 'dog/profile');
  await database.delete('Dog', where);
  return {
    ...constants['200'],
    body: null,
  };
};

module.exports.deletePhoto = async (req, _) => {
  const where = { id: req.payload.id };
  await photo.delete(req.payload.id, 'dog/profile');
  await database.update('Dog', { photo: null }, where);
  return this.get({
    params: { user: req.requester },
  });
};
