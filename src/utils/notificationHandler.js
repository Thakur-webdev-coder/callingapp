import messaging, { firebase } from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

let navigations = null;
import InCallManager from "react-native-incall-manager";
import { Store } from "../redux";
import { hangupMeeting } from "../lib-jitsi-meet/actions";

export const navigateScreen = (nav) => {
  console.log(nav, "dpoaopf");
  navigations = nav;
};

export const checkToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log("fcm_tokennnn", fcmToken);

    return fcmToken;
  }
};

export const showNotification = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log("remoteMegssage", remoteMessage);
    // Check if app is in foreground

    // CustomAlert(remoteMessage);

    if (remoteMessage?.data?.notification_type == "hangup_call") {
      console.log("hereeee -->>", remoteMessage?.data);

      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stopRingtone();
      InCallManager.stopRingback();

      Store.dispatch(hangupMeeting());

      navigations.navigate("Home");
    } else {
      InCallManager.startRingtone();

      navigations.navigate("IncomingScreen", {
        callData: remoteMessage?.data,
      });
    }
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);

    InCallManager.startRingtone();

    // // Create a notification
    // const notification = new firebase.notifications.Notification()
    //   .setTitle("New Notification Title")
    //   .setBody("New Notification Body")
    //   .setNotificationId("my_notification_id")
    //   .android.setChannelId("my_notification_channel");

    // // Display the notification
    // firebase.notifications().displayNotification(notification);
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("notification opened", remoteMessage);
    navigations.navigate("IncomingScreen", {
      callData: remoteMessage?.data,
    });
  });
};
