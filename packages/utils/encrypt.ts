import CryptoJS from "crypto-js";

const SECRET_KEY = "1234123412341234";

/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encrypt(word: string, skey: string = SECRET_KEY) {
  const keyHex = CryptoJS.enc.Utf8.parse(skey);
  const encrypted = CryptoJS.AES.encrypt(word, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export function decrypt(value: string, AESKey: string = SECRET_KEY) {
  const key = CryptoJS.enc.Utf8.parse(AESKey);
  const decrypt = CryptoJS.AES.decrypt(value, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

export default {};
