const config = process.env;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const iv = crypto.randomBytes(Number(config.INIT_VECTOR));
const key = crypto.randomBytes(Number(config.SECURITY_KEY));

const cipherEncrypt = data => {
  const iv = crypto.randomBytes(Number(config.INIT_VECTOR));
  const key = crypto.randomBytes(Number(config.SECURITY_KEY));
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

  return {
    key: key.toString('hex'),
    iv: iv.toString('hex'),
    cipher: encryptedData.toString('hex')
  };
};

const cipherDecrypt = data => {
  const iv = Buffer.from(data.iv, 'hex');
  const key = Buffer.from(data.key, 'hex');
  const encryptedData = Buffer.from(data.cipher, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  
  return decryptedData.toString();
};

module.exports = { cipherEncrypt, cipherDecrypt };