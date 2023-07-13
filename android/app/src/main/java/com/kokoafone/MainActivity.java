package com.kokoafone;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.google.firebase.FirebaseApp;

import org.devio.rn.splashscreen.SplashScreen; // here


public class
MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "kokoafone";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here
//    FirebaseApp.initializeApp(this);

//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//      NotificationChannel notificationChannel = new NotificationChannel("incoming_call", "Incoming Call", NotificationManager.IMPORTANCE_HIGH);
//      notificationChannel.setShowBadge(true);
//      notificationChannel.setDescription("");
//
//      AudioAttributes att = new AudioAttributes.Builder()
//              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
//              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
//              .build();
//      notificationChannel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE), att);
//      notificationChannel.enableVibration(true);
//      notificationChannel.setVibrationPattern(new long[]{400, 1000, 400});
//      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
//      NotificationManager manager = getSystemService(NotificationManager.class);
//
//      manager.createNotificationChannel(notificationChannel);
//
//    }



    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */



  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }
}
