import {JSEncrypt} from './jsencrypt';

const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDoJyG9b71aUceI+L/LRfrtP2oEaryrO+1WP/P4acD8EPVyDtz4l4dOHlQvE7/UTRvYCZyVN43+POYYVToWDO0x8aEG/Jk026KFu+8Nbxrc5KV5KfNamhNxkXAjkvsYzv/lt22nIAfSsznVNAu1JMIMkHPLuW/9T5IOluCyTTKO3QIDAQAB'

export function encrypt(data) {
    let encrypt = new JSEncrypt({
        default_key_size: 1024,
        default_public_exponent: '010001'
    });

    encrypt.setPublicKey(pubKey);

    return encrypt.encryptLong(data);
}