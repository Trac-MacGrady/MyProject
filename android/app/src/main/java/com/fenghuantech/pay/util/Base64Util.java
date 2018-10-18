package com.fenghuantech.pay.util;

import android.util.Base64;

import java.io.UnsupportedEncodingException;
/**
 * Created by Administrator on 2017/12/28 0028.
 */

public class Base64Util {
    static int flag = Base64.NO_WRAP;

    static byte[] encode(byte[] src) {
        return Base64.encode(src, flag);
    }

    static byte[] encode(String src) throws UnsupportedEncodingException {
        return encode(src.getBytes("UTF-8"));
    }

    public static String encodeToStr(byte[] src) throws UnsupportedEncodingException {
        return new String(encode(src), "UTF-8");
    }

    public static String encodeToStr(String src) throws UnsupportedEncodingException {
        return encodeToStr(src.getBytes("UTF-8"));
    }

    static byte[] decode(byte[] src) {
        return Base64.decode(src, flag);
    }

    static byte[] decode(String src) throws UnsupportedEncodingException {
        return decode(src.getBytes("UTF-8"));
    }

    public static String decodeToStr(byte[] src) throws UnsupportedEncodingException {
        return new String(decode(src), "UTF-8");
    }

    public static String decodeToStr(String src) throws UnsupportedEncodingException {
        return decodeToStr(src.getBytes("UTF-8"));
    }

}
