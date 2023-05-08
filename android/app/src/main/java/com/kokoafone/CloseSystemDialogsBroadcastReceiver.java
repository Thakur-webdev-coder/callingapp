package com.kokoafone;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class CloseSystemDialogsBroadcastReceiver extends BroadcastReceiver {


    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_CLOSE_SYSTEM_DIALOGS.equals(intent.getAction())) {
            // Handle the system dialog close event here
        }

    }
}