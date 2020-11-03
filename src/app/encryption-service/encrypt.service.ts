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
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(textToDecrypt) : string {
    return CryptoJS.AES.decrypt(textToDecrypt.toString(), this.secretKey).toString(CryptoJS.enc.Utf8);
  }
  
} 
