import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CriptoService {

  cryptoKey: string;
  cryptoIv: string;

  constructor() {
    this.cryptoKey = CryptoJS.enc.Utf8.parse('Medical-app-0134');
    this.cryptoIv = CryptoJS.enc.Utf8.parse('Medical-app-1859');
  }

  encrypt(plainText) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), this.cryptoKey, {
      keySize: 128 / 8,
      iv: this.cryptoIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  decrypt(ciphertext) {

    if (!ciphertext) {
      return '';
    }

    return CryptoJS.AES.decrypt(ciphertext, this.cryptoKey, {
      keySize: 128 / 8,
      iv: this.cryptoIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

}
