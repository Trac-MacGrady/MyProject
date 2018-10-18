package com.fenghuantech.pay.scan;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.fenghuantech.pay.constant.Constants;
import com.fenghuantech.pay.util.ImageUtils;

import io.card.payment.CardIOActivity;
import io.card.payment.CreditCard;
import io.reactivex.functions.Consumer;

/**
 * Created by lhk on 2018/6/9.
 */

public class BankCardScanModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = "Card";
    private static final String BANK_CARD_IMAGE = "bankCardImage";
    private static final String BANK_CARD_NO = "bankCardNo";
    private Activity mActivity;
    private Promise mPromise;

    @Override
    public String getName() {
        return "BankCardScanModule";
    }

    public BankCardScanModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @ReactMethod
    public void scanBankCard(Promise promise) {
        this.mPromise = promise;
        mActivity = getCurrentActivity();
        scanBankCard();
    }

    @ReactMethod
    public void takePicture(Promise promise) {
        this.mPromise = promise;
        mActivity = getCurrentActivity();
        justCaptureBankCard();
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.d(TAG, "requestCode: " + requestCode + "; resultCode: " + requestCode);
        switch (requestCode) {
            case Constants.SCAN_BANK_CARD_CODE:
                if (resultCode == CardIOActivity.RESULT_CARD_INFO) {
                    scanBankCardForResult(data);
                } else if (resultCode == CardIOActivity.RESULT_SCAN_SUPPRESSED) {
                    getCardImage(data, "");
                } else {
                    cancel();
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    private void scanBankCard() {
        Intent scanIntent = new Intent(this.mActivity, CardIOActivity.class);
        // customize these values to suit your needs.
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_EXPIRY, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_CVV, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_POSTAL_CODE, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_RESTRICT_POSTAL_CODE_TO_NUMERIC_ONLY, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_CARDHOLDER_NAME, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_RETURN_CARD_IMAGE, true);
        scanIntent.putExtra(CardIOActivity.EXTRA_USE_PAYPAL_ACTIONBAR_ICON, false);
        scanIntent.putExtra(CardIOActivity.EXTRA_HIDE_CARDIO_LOGO, true);

        // hides the manual entry button
        // if set, developers should provide their own manual entry mechanism in the app
        scanIntent.putExtra(CardIOActivity.EXTRA_SUPPRESS_MANUAL_ENTRY, true); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_LANGUAGE_OR_LOCALE, "zh-Hans");

        // matches the theme of your application
        scanIntent.putExtra(CardIOActivity.EXTRA_KEEP_APPLICATION_THEME, false); // default: false

        // MY_SCAN_REQUEST_CODE is arbitrary and is only used within this activity.
        this.mActivity.startActivityForResult(scanIntent, Constants.SCAN_BANK_CARD_CODE, null);
    }

    private void justCaptureBankCard() {
        Intent scanIntent = new Intent(this.mActivity, CardIOActivity.class);
        // customize these values to suit your needs.
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_EXPIRY, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_CVV, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_POSTAL_CODE, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_RESTRICT_POSTAL_CODE_TO_NUMERIC_ONLY, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_REQUIRE_CARDHOLDER_NAME, false); // default: false
        scanIntent.putExtra(CardIOActivity.EXTRA_RETURN_CARD_IMAGE, true);
        scanIntent.putExtra(CardIOActivity.EXTRA_USE_PAYPAL_ACTIONBAR_ICON, false);
        scanIntent.putExtra(CardIOActivity.EXTRA_HIDE_CARDIO_LOGO, true);
        scanIntent.putExtra(CardIOActivity.EXTRA_SUPPRESS_SCAN, true);
        scanIntent.putExtra(CardIOActivity.EXTRA_SUPPRESS_CONFIRMATION, true);
        scanIntent.putExtra(CardIOActivity.EXTRA_LANGUAGE_OR_LOCALE, "zh-Hans");
        scanIntent.putExtra(CardIOActivity.EXTRA_SCAN_RESULT, true);
        scanIntent.putExtra(CardIOActivity.EXTRA_CAPTURED_CARD_IMAGE, true);


        // hides the manual entry button
        // if set, developers should provide their own manual entry mechanism in the app
        scanIntent.putExtra(CardIOActivity.EXTRA_SUPPRESS_MANUAL_ENTRY, true); // default: false

        // matches the theme of your application
        scanIntent.putExtra(CardIOActivity.EXTRA_KEEP_APPLICATION_THEME, false); // default: false

        // MY_SCAN_REQUEST_CODE is arbitrary and is only used within this activity.
        this.mActivity.startActivityForResult(scanIntent, Constants.SCAN_BANK_CARD_CODE, null);
    }

    private void scanBankCardForResult(Intent data) {
        if (data == null){
            cancel();
            return;
        }
        Log.d(TAG, "scanBankCardForResult");
        String resultStr;
        Bundle extra = data.getExtras();
        if (extra != null && data.hasExtra(CardIOActivity.EXTRA_SCAN_RESULT)) {
            CreditCard scanResult = data.getParcelableExtra(CardIOActivity.EXTRA_SCAN_RESULT);

            // Never log a raw card number. Avoid displaying it, but if necessary use getFormattedCardNumber()
            String cardNumber = scanResult.getFormattedCardNumber().replaceAll(" ", "");
            resultStr = "Card Number: " + scanResult.getRedactedCardNumber() + "\n";
            Log.d(TAG, resultStr);
            getCardImage(data, cardNumber);
        } else {
            resultStr = "Scan was canceled.";
            Log.d(TAG, resultStr);
            cancel();
        }

    }

    private void getCardImage(Intent data, final String cardNumber) {
        if (data == null){
            cancel();
            return;
        }
        if (data.hasExtra(CardIOActivity.EXTRA_CAPTURED_CARD_IMAGE)) {
            Bitmap bitmap = CardIOActivity.getCapturedCardImage(data);
            if (bitmap != null) {
                String filename = String.valueOf(System.currentTimeMillis())+ ".jpg";
                ImageUtils.compressAndSave(bitmap, filename, this.mActivity)
                        .subscribe(new Consumer<Uri>() {
                            @Override
                            public void accept(Uri path) {
                                Log.d(TAG, path.toString());
                                WritableMap map = Arguments.createMap();
                                map.putString(BANK_CARD_IMAGE, path.toString());
                                map.putString(BANK_CARD_NO, cardNumber);
                                BankCardScanModule.this.mPromise.resolve(map);
                            }
                        });
            } else {
                cancel();
            }
        } else {
            cancel();
        }
    }

    private void cancel(){
        if (mPromise != null) {
            mPromise.reject(new Error("扫描失败"));
        } else {
            Log.d(TAG, "mPromise为null");
        }
    }
}

