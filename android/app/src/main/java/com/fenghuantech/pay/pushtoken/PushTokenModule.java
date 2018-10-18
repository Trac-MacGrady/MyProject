package com.fenghuantech.pay.pushtoken;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.fenghuantech.pay.util.SpUtil;

/**
 * Description:
 * created by : wh
 * Date       : 2018/8/20 11:21
 */

public class PushTokenModule extends ReactContextBaseJavaModule {
    public PushTokenModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PushTokenModule";
    }

    @ReactMethod
    public void getDeviceToken(Promise promise) {
        String deviceToken = SpUtil.getInstance().getStringValue("device_token", "");
        WritableMap map = Arguments.createMap();
        map.putString("device_token", deviceToken);
        Log.e("deviceToken" , "token:" + deviceToken);
        promise.resolve(map);
    }
}
