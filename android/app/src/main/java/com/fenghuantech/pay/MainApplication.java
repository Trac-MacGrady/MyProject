package com.fenghuantech.pay;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.RNRSA.RNRSAPackage;
import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.fenghuantech.pay.image.ImageResizerPackage;
import com.fenghuantech.pay.pushtoken.PushTokenPackage;
import com.fenghuantech.pay.scan.BankCardScanPackage;
import com.fenghuantech.pay.scan.IDCardScanPackage;
import com.fenghuantech.pay.share.WechatSharePackage;
import com.fenghuantech.pay.util.SpUtil;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.horcrux.svg.SvgPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.tencent.bugly.crashreport.CrashReport;
import com.wix.RNCameraKit.RNCameraKitPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
             return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            new RealmReactPackage(),
                new RNExitAppPackage(),
//                new RNFSPackage(),
                new SvgPackage(),
                new RNRSAPackage(),
                new RNFetchBlobPackage(),
                new LinearGradientPackage(),
                new BankCardScanPackage(),
                new IDCardScanPackage(),
                new WechatSharePackage(),
                new RNCameraKitPackage(),
                new ImageResizerPackage(),
                new PushTokenPackage(),
                new PickerPackage(),
                new CodePush("tEoAwzTSwzTdXgKkBmU1yVDCXd1n02509156-6c58-4470-8fee-cac07564fb03", MainApplication.this, BuildConfig.DEBUG)
        );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
      SpUtil.getInstance().init(this);
    CrashReport.initCrashReport(getApplicationContext(), "9c13fd5cc7", true); // bugly crash report
  }

    @Override
    protected void attachBaseContext(Context base) {
       super.attachBaseContext(base);
       MultiDex.install(this);
    }
}
