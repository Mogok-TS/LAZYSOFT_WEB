import { Injectable } from '@angular/core';
import * as CryptoJS from '../../../node_modules/crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  secretKey = "MySecretKeyForEncryption&Descryption";
  salt = CryptoJS.lib.WordArray.random(128 / 8);
  iv = CryptoJS.lib.WordArray.random(128 / 8);

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey, this.salt.toString(), this.iv.toString()).toString();
  }

  decrypt(textToDecrypt: string) {
    // return "hello"
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7}
    ).toString(CryptoJS.enc.Utf8);
  }
  
} 
