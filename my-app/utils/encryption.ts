import CryptoJS from 'crypto-js';

export const generateKey = (signature: string) => {
  return CryptoJS.SHA256(signature).toString();
};


export const encryptData = (data: any, key: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};


export const decryptData = (ciphertext: string, key: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
  } catch (e) {
    return null; 
  }
};