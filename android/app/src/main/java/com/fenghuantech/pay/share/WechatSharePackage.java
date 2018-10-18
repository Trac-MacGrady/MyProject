package com.fenghuantech.pay.share;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.fenghuantech.pay.scan.BankCardScanModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by lhk on 2018/6/9.
 */

public class WechatSharePackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new WechatShareModule(reactContext));
        return modules;
    }


    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();

    }
}
