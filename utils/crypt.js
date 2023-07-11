const crypto = require('crypto');

function objectToString (obj) {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) obj = { data: obj };
  return JSON.stringify(obj);
};

function stringToObject (str) {
  if (typeof str === 'string') return str;
  const obj = JSON.parse(str);
  if (Array.isArray(obj)) return obj.data;
  return obj;
};

function createCipher (type) {
  const iv = Buffer.alloc(16);
  const key = crypto
    .createHmac('sha256', process.env.ENCRYPTION_PASSWORD)
    .update(process.env.ENCRYPTION_KEY)
    .digest('base32');
  return crypto[`create${type}iv`]('aes-256-cbc', key, iv);
};

module.exports.password = (data) => {
  return crypto.createHash('sha256').update(data).digest('base64');
}

module.exports.encrypt = (data) => {
  if (!data) return data;
  const cipher = createCipher('Cipher');
  const crypted = cipher.update(objectToString(data), 'utf8', 'base64');
  return crypted + cipher.final('base64');
};

module.exports.decrypt = (text) => {
  if (!data) return data;
  const decipher = createCipher('Decipher');
  const decrypted = decipher.update(text, 'base64', 'utf8');
  return stringToObject(decrypted + decipher.final('utf8'));
};