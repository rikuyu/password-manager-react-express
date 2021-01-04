const crypto = require("crypto");
require("dotenv").config();
const ENCRYPT_ALGORITHM = "aes-256-ctr";

const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16)); //初期化ベクトル(initialization vector)
  const cipher = crypto.createCipheriv(
    ENCRYPT_ALGORITHM,
    Buffer.from(process.env.COMMON_ENCRYPT_KEY), //共通鍵
    iv
  );

  const encryptions = Buffer.concat([cipher.update(password), cipher.final()]);

  return { iv: iv.toString("hex"), password: encryptions.toString("hex") };
};

const decrypt = (encryption) => {
  const decipher = crypto.createDecipheriv(
    ENCRYPT_ALGORITHM,
    Buffer.from(process.env.COMMON_ENCRYPT_KEY),
    Buffer.from(encryption.iv, "hex")
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};

module.exports = { encrypt, decrypt };
