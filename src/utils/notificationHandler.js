import messaging, { firebase } from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { Alert, NativeModules, Platform, Vibration } from "react-native";
let callingData = null;
let navigations = null;
import InCallManager from "react-native-incall-manager";
import { Store } from "../redux";
import { hangupMeeting } from "../lib-jitsi-meet/actions";
import {
  fromInActiveState,
  getBooleanValue,
  setCategories,
  setToken,
  showIncVoiceCall,
} from "./commonUtils";
import PushNotification, { Importance } from "react-native-push-notification";

let myMesaggeNotification = null;
import notifee, { AndroidCategory } from "@notifee/react-native";
import Sip from "@khateeb00/react-jssip";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const navigateScreen = (nav) => (navigations = nav);
export const sendDataTonofiyHandler = (data) => (callingData = data);

export const checkToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log(fcmToken, "=========31");
    setToken(fcmToken);
    return fcmToken;
  }
};
// NOTIFICATION RELATED SECTION =======>>>>>>>>>>>>

// NOTIFICATION FORGROUND  SECTION STARTS =======>>>>>>>>>>>>
export const showNotification = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log(remoteMessage, "================onForGround");

    myMesaggeNotification = remoteMessage;
    if (remoteMessage?.data?.notification_type == "hangup_call") {
      console.log("hereeee -->>", remoteMessage?.data);
      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stopRingtone();
      InCallManager.stopRingback();
      Store.dispatch(hangupMeeting());
      navigations.navigate("Home");
    } else if (remoteMessage?.data?.notification_type == "call") {
      console.log("callll====s");
      InCallManager.startRingtone();
      navigations.navigate("IncomingScreen", {
        callData: remoteMessage?.data,
      });
    } else if (remoteMessage?.data?.notification_type == "group_call") {
      console.log("callll====s");
      InCallManager.startRingtone();
      navigations.navigate("IncomingScreen", {
        callData: remoteMessage?.data,
      });
    } else if (remoteMessage?.data?.notification_type === "SINGLE_CHAT") {
      console.log("insinglechat");
      getBooleanValue("isFocused").then((data) => {
        console.log("isFocused", data);

        if (!data) {
          console.log("i'm herer", remoteMessage);
          // showLocalNotification(remoteMessage);
          showLocallotification(remoteMessage);
        }
      });
    } else if (remoteMessage?.data?.notification_type === "GROUP_CHAT") {
      getBooleanValue("isFocused").then((data) => {
        console.log("isFocused", data);

        if (!data) {
          // showLocalNotification(remoteMessage);
          showLocallotification(remoteMessage);
        }
      });
    }
  });
  // NOTIFICATION FORGROUND  SECTION ENDS =======>>>>>>>>>>>>

  // NOTIFICATION BACKGROUND  SECTION STARTS =======>>>>>>>>>>>>

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log(
      detail?.notification?.android?.channelId,
      "=========>>>267",
      detail?.pressAction?.id
    );
    if (
      detail?.pressAction?.id === "decline" &&
      detail?.notification?.android?.channelId === "voicecallBcg"
    ) {
      rejectCall(callingData);
    } else if (
      detail?.pressAction?.id === "accept" &&
      detail?.notification?.android?.channelId === "voicecallBcg"
    ) {
      acceptVoiceCall(callingData);
      InCallManager.stopRingtone();
    }
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("BACKGROUND HANDLERE", remoteMessage);
    if (remoteMessage?.data?.notification_type == "call") {
      InCallManager.startRingtone();
      setCategories();
      fromInActiveState(remoteMessage);
    } else if (remoteMessage?.data?.notification_type == "hangup_call") {
      InCallManager.stopRingtone();
      PushNotification.cancelAllLocalNotifications();
    } else if (remoteMessage?.data?.body === "Audio Calling") {
      showIncVoiceCall(remoteMessage);
    }
  });

  // NOTIFICATION BACKGROUND  SECTION ENDS =======>>>>>>>>>>>>

  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage?.data?.notification_type === "call") {
        setTimeout(() => {
          navigations.navigate("IncomingScreen", {
            callData: remoteMessage?.data,
          });
        }, 200);
      } else if (remoteMessage?.data?.notification_type === "hangup_call") {
      } else if (remoteMessage?.data?.notification_type === "SINGLE_CHAT") {
        console.log("=========>>109");
        setTimeout(() => {
          navigations.navigate("UserChatsScreen", {
            callData: remoteMessage?.data?.sid,
          });
        }, 200);
      } else if (remoteMessage?.data?.notification_type === "GROUP_CHAT") {
        setTimeout(() => {
          let participants = remoteMessage?.data?.participants;

          let result = participants.split(",").map(function (value) {
            return value.trim();
          });
          navigations.navigate("UserChatsScreen", {
            groupName: remoteMessage?.data?.group_name,
            uniqueId: remoteMessage?.data?.group_id,
            participants: result,
          });
        }, 200);
      }
    });

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log("hererrerererNotiitiitit");

    if (remoteMessage?.data?.notification_type == "call") {
      console.log("notification opened======>>>>>168", remoteMessage);
      navigations.navigate("IncomingScreen", {
        callData: remoteMessage?.data,
      });
    } else if (remoteMessage?.data?.notification_type === "SINGLE_CHAT") {
      console.log("hererrerererNotiitiitit----------");
      navigations.navigate("UserChatsScreen", {
        callData: remoteMessage?.data?.sid,
      });
    } else if (remoteMessage?.data?.notification_type === "GROUP_CHAT") {
      let participants = remoteMessage?.data?.participants;

      let result = participants.split(",").map(function (value) {
        return value.trim();
      });
      navigations.navigate("UserChatsScreen", {
        groupName: remoteMessage?.data?.group_name,
        uniqueId: remoteMessage?.data?.group_id,
        participants: result,
      });
    }
  });
};

const showLocallotification = (remoteMessage) => {
  console.log("sln------------------------------------------->>");
  PushNotification.localNotification({
    title: remoteMessage?.notification?.title,
    message: remoteMessage?.notification?.body,
    playSound: true,
    soundName: "default",
    importance: Importance.HIGH,
    id: "12345",
    channelId: "12345",
    data: remoteMessage,
  });
};

// const showLocallotification = async (remoteMessage) => {
//   console.log("inactiivvv====>>>>>", remoteMessage);

//   const channelId = await notifee.createChannel({
//     id: "12345",
//     name: "Important Notifications",
//     importance: 4,
//   });
//   await notifee.displayNotification({
//     title: remoteMessage?.notification?.title,
//     body: remoteMessage?.notification?.body,
//     id: "12345",
//     data: remoteMessage.data,
//   });
// };

const mesageViewnavigation = () => {
  if (myMesaggeNotification?.data?.notification_type === "SINGLE_CHAT") {
    navigations.navigate("UserChatsScreen", {
      callData: myMesaggeNotification?.data?.sid,
    });
  } else if (myMesaggeNotification?.data?.notification_type === "GROUP_CHAT") {
    let participants = myMesaggeNotification?.data?.participants;

    let result = participants.split(",").map(function (value) {
      return value.trim();
    });
    navigations.navigate("UserChatsScreen", {
      groupName: myMesaggeNotification?.data?.group_name,
      uniqueId: myMesaggeNotification?.data?.group_id,
      participants: result,
    });
  }
};

// NOFICATION CONFIGURATION ===========CONFIGURATION =================>>>CONFIGRATION

export const configureNotification = () => {
  console.log("this is congitugrie  =========>>>>>>");

  PushNotification.configure({
    onNotification: function (notification) {
      console.log(notification, "============185");

      if (notification?.userInteraction && notification?.foreground) {
        mesageViewnavigation();
      }
      if (notification?.data?.data?.notification_type === "SINGLE_CHAT") {
        navigations.navigate("UserChatsScreen", {
          callData: notification?.data?.data?.sid,
        });
      } else if (
        notification.userInteraction &&
        notification?.id === "KILLSTATE"
      ) {
        setTimeout(() => {
          InCallManager.stopRingtone();
          navigations.navigate("CallScreen", {
            voiceCall: notification?.data?.Type == "A" ? true : false,
            fromNotification: true,
            callData: notification?.data?.sender_phone,
            meetimgUrl: notification?.data?.Meeting_url,
          });
        }, 200);
      } else if (
        notification?.userInteraction &&
        notification?.android?.channelId === "voicecallkillstate"
      ) {
      } else if (notification?.data?.data?.notification_type === "GROUP_CHAT") {
        let participants = notification?.data?.data?.participants;

        let result = participants.split(",").map(function (value) {
          return value.trim();
        });
        navigations.navigate("UserChatsScreen", {
          groupName: notification?.data?.data?.group_name,
          uniqueId: notification?.data?.data?.group_id,
          participants: result,
        });
      } else if (notification?.data?.data?.notification_type === "call") {
        if (notification.userInteraction) {
          console.log("acccept Clciked", notification.action);
          if (notification.action == "Accept") {
            InCallManager.stopRingtone();
            navigations.navigate("CallScreen", {
              voiceCall: notification?.data?.data?.Type == "A" ? true : false,
              fromNotification: true,
              callData: notification?.data?.data?.sender_phone,
              meetimgUrl: notification?.data?.data?.Meeting_url,
            });
          } else if (notification.action == "Reject") {
            console.log("User pressed Reject button on the notification!");
          }
        }
      }
    },

    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
    },
  });
};

// NOFICATION CONFIGURATION ===========CONFIGURATION =================>>>CONFIGRATION

// const showIncomingCallNotification = (remoteMessage) => {
//   InCallManager.startRingtone();
//   PushNotification.localNotification({
//     channelId: "12345",
//     title: remoteMessage.notification.title,
//     message: remoteMessage.notification.body,
//     smallIcon: null,
//     ongoing: true,
//     actions: ["Accept", "Reject"],
//   });
// };

export const changelCreated = () => {
  PushNotification.createChannel({
    channelId: "12345", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  });
};

const acceptVoiceCall = (call) => {
  const SipCallID = Sip.getFormattedCallId(call);
  if (SipCallID) {
    Sip.answerCall(SipCallID)
      .then(() => {
        InCallManager.stopRingtone();
        navigations.navigate("CallingScreen", {
          callData: call._remote_identity._display_name,
        });
      })
      .catch((error) => {
        console.log("---answerCall-error-incoming---", error);
      });
    return;
  }

  // console.log(call, "call from 444====>>>>>>>.");
  // navigations.navigate("IncomingAudioCall", {
  //   call: call,
  // });
};

const rejectCall = (call) => {
  const SipCallId = Sip.getFormattedCallId(call);
  if (SipCallId) {
    console.log("SipCallId - if -->");
    InCallManager.stopRingtone();
    Vibration.cancel();
    Sip.declineCall(SipCallId);
    navigations.navigate("Home");
    // onSipCallAccepted();
  } else {
    console.log("--Else-SipCallId--");
  }
};
