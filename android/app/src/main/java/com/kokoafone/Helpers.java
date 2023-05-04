package com.kokoafone;


import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class Helpers extends ReactContextBaseJavaModule {
    public static final String NAME = "Helpers";
    private static final int OVERLAY_PERMISSION_REQUEST_CODE
            = (int) (Math.random() * Short.MAX_VALUE);

    Helpers(ReactApplicationContext context) {
        super(context);
    }
    @ReactMethod
   public void openApp() {
        try {
            Intent newIntent = new Intent(getReactApplicationContext(), Class.forName("com.kokoafone.MainActivity"));
            newIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            Log.d("----openApp---", "success---");
            getReactApplicationContext().startActivity(newIntent);
        } catch (ClassNotFoundException e) {
            Log.d("----openApp---", "error---" + e);
        }
    }


    @NonNull
    @Override
    public String getName() {
        return NAME;
    }
}