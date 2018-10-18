package com.fenghuantech.pay.util;


import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;

/**
 * Created by Administrator on 2017/12/28 0028.
 * RSA 加密工具类
 */

public class RSAUtil {
    public static final String RSA_ALGORITHM = "RSA";
    public static final String SIGNATURE_ALGORITHM = "MD5withRSA";
    public static final Integer ENCRYPT_MOD = 100;
    public static final Integer DECRYPT_MOD = 128;
    private static String RSA_ANDROID = "RSA/ECB/PKCS1Padding";
    private static String RSA_JAVA = "RSA/ECB/PKCS1Padding";

    /**
     * 用私钥对密文进行数字签名
     *
     * @param cipherText 密文
     * @param privateKey 私钥
     * @return 签名
     */
    public static String sign(String cipherText, String privateKey)
            throws UnsupportedEncodingException, InvalidKeySpecException, NoSuchAlgorithmException, InvalidKeyException, SignatureException {
        //
        byte[] cipherBytes = cipherText.getBytes("UTF-8");
        byte[] keyBytes = Base64Util.decode(privateKey);
        //sign
        byte[] signBytes = signBytes(cipherBytes, keyBytes);

        return Base64Util.encodeToStr(signBytes);
    }

    private static byte[] signBytes(byte[] cipherBytes, byte[] keyBytes)
            throws NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException, SignatureException {
        // 构造PKCS8EncodedKeySpec对象
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        // RSA_ALGORITHM 指定的加密算法
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        // 取私钥匙对象
        PrivateKey priKey = keyFactory.generatePrivate(pkcs8KeySpec);
        // 用私钥对信息生成数字签名
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initSign(priKey);
        signature.update(cipherBytes);

        return signature.sign();
    }

    /**
     * 校验数字签名
     *
     * @param cipherText 密文
     * @param publicKey  公钥
     * @param sign       数字签名
     * @return true: 校验成功; false: 失败
     */
    public static boolean verifySign(String cipherText, String publicKey, String sign) throws Exception {
        return verify(cipherText.getBytes("UTF-8"),
                Base64Util.decode(publicKey), Base64Util.decode(sign));
    }

    private static boolean verify(byte[] data, byte[] publicBytes, byte[] signBytes)
            throws Exception {
        // 构造X509EncodedKeySpec对象
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicBytes);
        // RSA_ALGORITHM 指定的加密算法
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        // 取公钥匙对象
        PublicKey pubKey = keyFactory.generatePublic(keySpec);

        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initVerify(pubKey);
        signature.update(data);

        // 验证签名是否正常
        return signature.verify(signBytes);
    }

    /**
     * 解密
     *
     * @param cipherText 密文
     * @param privateKey 私钥
     * @return 明文
     */
    public static String decryptByPrivateKey(String cipherText, String privateKey) throws Exception {
        byte[] bytes = decryptByPrivate(Base64Util.decode(cipherText), Base64Util.decode(privateKey));
        return new String(bytes, "UTF-8");
    }

    private static byte[] decryptByPrivate(byte[] data, byte[] privateBytes)
            throws Exception {
        // 取得私钥
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(privateBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
        // 对数据解密
//        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        Cipher cipher = Cipher.getInstance(RSA_ANDROID);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);

        return blockCipher(data, cipher, Cipher.DECRYPT_MODE);
    }

    /**
     * 解密
     *
     * @param cipherText 密文
     * @param publicKey  公钥
     * @return 明文
     */
    public static String decryptByPublicKey(String cipherText, String publicKey) throws Exception {
        byte[] bytes = decryptByPublic(Base64Util.decode(cipherText), Base64Util.decode(publicKey));
        return new String(bytes, "UTF-8");
    }

    private static byte[] decryptByPublic(byte[] data, byte[] publicBytes)
            throws Exception {
        // 取得公钥
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(publicBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        Key publicKey = keyFactory.generatePublic(x509KeySpec);

        // 对数据解密
//        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        Cipher cipher = Cipher.getInstance(RSA_ANDROID);
        cipher.init(Cipher.DECRYPT_MODE, publicKey);

        return blockCipher(data, cipher, Cipher.DECRYPT_MODE);
    }

    /**
     * 加密
     *
     * @param plaintext 明文
     * @param publicKey 公钥
     * @return 密文
     */
    public static String encryptByPublicKey(String plaintext, String publicKey) throws Exception {
        byte[] cipherBytes = encryptByPublic(plaintext.getBytes("UTF-8"), Base64Util.decode(publicKey));
        return Base64Util.encodeToStr(cipherBytes);
    }

    private static byte[] encryptByPublic(byte[] data, byte[] publicBytes)
            throws Exception {
        // 取得公钥
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(publicBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        Key publicKey = keyFactory.generatePublic(x509KeySpec);

        // 对数据加密
//        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        Cipher cipher = Cipher.getInstance(RSA_JAVA);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);

        return blockCipher(data, cipher, Cipher.ENCRYPT_MODE);
    }

    /**
     * 加密
     *
     * @param plaintext  明文
     * @param privateKey 密钥
     * @return 密文
     */
    public static String encryptByPrivateKey(String plaintext, String privateKey) throws Exception {
        byte[] cipherBytes = encryptByPrivate(plaintext.getBytes("UTF-8"), Base64Util.decode(privateKey));
        return Base64Util.encodeToStr(cipherBytes);
    }

    private static byte[] encryptByPrivate(byte[] data, byte[] privateBytes)
            throws Exception {
        // 取得私钥
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(privateBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);

        // 对数据加密
//        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        Cipher cipher = Cipher.getInstance(RSA_JAVA);
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);
        return blockCipher(data, cipher, Cipher.ENCRYPT_MODE);
    }

    private static byte[] blockCipher(byte[] data, Cipher cipher, int mode) throws BadPaddingException, IllegalBlockSizeException {
        int mod = (mode == Cipher.DECRYPT_MODE) ? DECRYPT_MOD : ENCRYPT_MOD;

        byte[] result = new byte[0];

        for (int i = 0; i < Math.ceil((float) data.length / (float) mod); i++) {
            int length = ((i + 1) * mod > data.length) ? data.length - i * mod : mod;
            byte[] buffer = new byte[length];
            System.arraycopy(data, i * mod, buffer, 0, length);
            byte[] bytes = cipher.doFinal(buffer);
            result = append(result, bytes);
        }
        ;
        return result;
    }

    private static byte[] append(byte[] prefix, byte[] suffix) {
        byte[] appended = new byte[prefix.length + suffix.length];
        System.arraycopy(prefix, 0, appended, 0, prefix.length);
        System.arraycopy(suffix, 0, appended, prefix.length, suffix.length);
        return appended;
    }

    /**
     * 获取私钥
     *
     * @param keyPair Key Pair
     * @return
     */
    public static String getPrivateKey(KeyPair keyPair) throws UnsupportedEncodingException {
        return Base64Util.encodeToStr(getPrivateBytes(keyPair));
    }

    private static byte[] getPrivateBytes(KeyPair keyPair) {
        return keyPair.getPrivate().getEncoded();
    }

    /**
     * 获取公钥
     *
     * @param keyPair Key Pair
     * @return
     */
    public static String getPublicKey(KeyPair keyPair) throws UnsupportedEncodingException {
        return Base64Util.encodeToStr(getPublicBytes(keyPair));
    }

    private static byte[] getPublicBytes(KeyPair keyPair) {
        return keyPair.getPublic().getEncoded();
    }

    /**
     * 生成密钥
     */
    public static KeyPair initKey() throws NoSuchAlgorithmException {
        ;
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        keyPairGen.initialize(1024);
        return keyPairGen.generateKeyPair();
    }
}
