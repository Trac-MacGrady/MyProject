import utf8 from 'utf8';
import forge from 'node-forge';
import EncryptInfo from "../const/EncryptInfo";

export default class MD5Util {
    static generateSign(data){
        let keys = Object.keys(data).sort();
        let Buffer = require('buffer').Buffer;
        let sourceStr = keys.reduce((initValue, key) => {
            return initValue + key + '=' +  new Buffer(utf8.encode(data[key])).toString('base64');
        }, '');

        let md = forge.md.md5.create();
        md.update(EncryptInfo.pubKey + sourceStr + EncryptInfo.pubKey);
        return md.digest().toHex();
    }
}