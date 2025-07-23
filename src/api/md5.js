import CryptoJS from 'crypto-js'
const key= CryptoJS.enc.Utf8.parse("TuRuan2019")

// 加密
export function RC4(data) {
  if (data) {
    try{
      data = CryptoJS.enc.Utf8.parse(data)
      let decipher = CryptoJS.RC4.encrypt(data, key)
      return decipher.toString(CryptoJS.format.Hex)
    } catch (e) {
      console.error(e.toString())
    }
    return data
  } else {
    return ''
  }
}

// 解密
export function decryptRC4(src) {
  if (src) {
    try{
      let srcs = CryptoJS.enc.Hex.parse(src.toString())
      let decryptdata = CryptoJS.RC4.decrypt(CryptoJS.lib.CipherParams.create({ ciphertext:srcs}), key)
      return CryptoJS.enc.Utf8.stringify(decryptdata)
    } catch (e) {
      console.error(e)
    }
    return src
  } else {
    return ''
  }
}

export function md5(data) {
  return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex)
}

// //var ctext = rc4("我是明文","我是密码");
// //var text = rc4(ctext, "我是密码");
// function rc4(data, key) {
//   var seq = Array(256); //int
//   var das = Array(data.length); //code of data
//   for (var i = 0; i < 256; i++) {
//     seq[i] = i;
//     var j = (j + seq[i] + key.charCodeAt(i % key.length)) % 256;
//     var temp = seq[i];
//     seq[i] = seq[j];
//     seq[j] = temp;
//   }
//   for (var i = 0; i < data.length; i++) {
//     das[i] = data.charCodeAt(i)
//   }
//   for (var x = 0; x < das.length; x++) {
//     var i = (i + 1) % 256;
//     var j = (j + seq[i]) % 256;
//     var temp = seq[i];
//     seq[i] = seq[j];
//     seq[j] = temp;
//     var k = (seq[i] + (seq[j] % 256)) % 256;
//     das[x] = String.fromCharCode(das[x] ^ seq[k]);
//   }
//   return das.join('');
// }
