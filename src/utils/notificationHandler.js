// import { ReactNativeFirebase } from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import CustomAlert from "./CustomAlertMessage";

let navigations = null;

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

    Alert.alert("Video Call", "Received", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "join",
        onPress: () =>
          navigations.navigate("CallScreen", {
            voiceCall: true,
          }),
      },
    ]);

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
};
