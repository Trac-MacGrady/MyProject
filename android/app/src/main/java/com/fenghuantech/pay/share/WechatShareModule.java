package com.fenghuantech.pay.share;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.fenghuantech.pay.R;
import com.hutong.supersdk.createqrcode.QRCodeWithIcon;
import com.library.share.wxapi.WXApiConfig;
import com.library.share.wxapi.WXShareUtil;

import java.net.PortUnreachableException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by lhk on 2018/6/9.
 */

public class WechatShareModule extends ReactContextBaseJavaModule{
    private static final String TAG = "wechat";
    private static final String SESSION = "wx_scene_session";
    private static final String TIMELINE = "wx_scene_timeline";

    @Override
    public String getName() {
        return "WechatShareModule";
    }

     @Override
    public Map<String, Object> getConstants(){
        final Map<String, Object> constants = new HashMap<>();
        constants.put(SESSION, WXApiConfig.WX_SCENE_SESSION);
        constants.put(TIMELINE, WXApiConfig.WX_SCENE_TIMELINE);
        return constants;
    }

    public WechatShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @ReactMethod
    public void shareWithSession(String url){
        share(WXApiConfig.WX_SCENE_SESSION, url);
    }

    @ReactMethod
    public void shareWithTimeline(String url) {
        share(WXApiConfig.WX_SCENE_TIMELINE, url);
    }

    private void share(int type, String url){
        Log.d(TAG, url);
        Activity mActivity = getCurrentActivity();
        WXShareUtil.init(mActivity);
        Bitmap bitmap = QRCodeWithIcon.createQRCodeWithLogo(url,  300,
       BitmapFactory.decodeResource(mActivity.getResources(), R.drawable.image_ic_logo));
        WXShareUtil.shareBitmapToWX(type, bitmap);
    }
}

