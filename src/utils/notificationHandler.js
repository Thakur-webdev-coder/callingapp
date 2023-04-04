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
    console.log("remoteMegssage", remoteMessage?.data);
    // Check if app is in foreground

    // CustomAlert(remoteMessage);

    if (remoteMessage?.data?.notification_type == "hangup_call") {
      console.log("hereeee -->>", remoteMessage?.data);

      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stopRingtone();

      Store.dispatch(hangupMeeting());

      navigations.navigate("Home");
    } else {
      InCallManager.startRingtone();

      navigations.navigate("IncomingScreen", {
        callData: remoteMessage?.data,
      });
    }

    // Alert.alert("Video Call", "Received", [
    //   {
    //     text: "Cancel",
    //     onPress: () => null,
    //     style: "cancel",
    //   },
    //   {
    //     text: "join",
    //     onPress: () =>
    //       navigations.navigate("CallScreen", {
    //         voiceCall: true,
    //       }),
    //   },
    // ]);

    // Alert.alert("", () => null);

    // showErrorMessage(remoteMessage.notification.body);

    // If app is in foreground, display a local notification
    // const notification = new ReactNativeFirebase.notifications.Notification()
    //   .setNotificationId(remoteMessage.messageId)
    //   .setTitle(remoteMessage.notification.title)
    //   .setBody(remoteMessage.notification.body);

    // if (Platform.OS === "android") {
    //   notification.android.setChannelId("default");
    //   notification.android.setSmallIcon("ic_launcher");
    //   notification.android.setColor("#000000");
    //   notification.android.setPriority(
    //     ReactNativeFirebase.notifications.Android.Priority.High
    //   );
    //   notification.android.setAutoCancel(true);
    // }
    // console.log("notification", notification);

    // await ReactNativeFirebase.notifications().displayNotification(notification);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
    // Process your remote message data here

    // const notification =  firebase.notification.Notification()
    //   .setNotificationId("notification-id")
    //   .setTitle("My Notification Title")
    //   .setBody("My Notification Message")
    //   .setSound("default")
    //   .setPriority(firebase.notifications.Android.Priority.High);

    // const channel = new firebase.notifications.Android.Channel(
    //   "channel-id",
    //   "My Notification Channel",
    //   firebase.notifications.Android.Importance.High
    // ).setDescription("My Notification Channel Description");

    // firebase.notifications().android.createChannel(channel);

    // notification.android.setChannelId("channel-id");
    // notification.setData(data);
    // firebase.notifications().displayNotification(notification);
  });

  // messaging().onNotificationDisplayed((notification) => {
  //   console.log("Notification displayed:", notification);
  //   // Do something with the notification data
  // });

  // messaging().onNotification((notification) => {
  //   console.log("Notification received:", notification);
  //   // Do something with the notification data
  // });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        // Do something with the notification data
      }
    });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    navigations.navigate("IncomingScreen");
  });
};
