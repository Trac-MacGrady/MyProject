package com.fenghuantech.pay.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

public class SpUtil {

    private static final String SP_NAME = "mirrorservice";

    public static final String KEY_LAST_MIRROR_FILE = "last_mirror_file";

    private SharedPreferences sp;
    private static SpUtil instance = null;

    public static SpUtil getInstance() {
        if (null != instance) {
            return instance;
        }

        synchronized (SpUtil.class) {
            if (null == instance) {
                instance = new SpUtil();
            }
        }

        return instance;
    }

    public void init(Context context) {
        sp = context.getSharedPreferences(SP_NAME, Context.MODE_PRIVATE);
    }

    public void setIntValue(String key, int value) {
        if (null != sp) {
            Editor editor = sp.edit();
            editor.putInt(key, value);
            editor.commit();
        }
    }

    public int getIntValue(String key, int defValue) {
        int retVal = -1;
        if (null != sp) {
            retVal = sp.getInt(key, defValue);
        }

        return retVal;
    }

    public void setStringValue(String key, String value) {
        if (null != sp) {
            Editor editor = sp.edit();
            editor.putString(key, value);
            editor.commit();
        }
    }

    public String getStringValue(String key, String defValue) {
        String retVal = null;
        if (null != sp) {
            retVal = sp.getString(key, defValue);
        }

        return retVal;
    }

    public void setBooleanValue(String key, boolean value) {
        if (null != sp) {
            Editor editor = sp.edit();
            editor.putBoolean(key, value);
            editor.commit();
        }
    }

    public boolean getBooleanValue(String key, boolean defValue) {
        boolean retVal = false;
        if (null != sp) {
            retVal = sp.getBoolean(key, defValue);
        }

        return retVal;
    }
}
