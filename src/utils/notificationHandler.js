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
} from "./commonUtils";
import { Socket } from "socket.io-client";
import { getSocket } from "./socketManager";
import PushNotification, { Importance } from "react-native-push-notification";
import Loading from "react-native-whc-loading";
let myMesaggeNotification = null;
import notifee, { AndroidCategory } from "@notifee/react-native";
import { hithangUpCallApi } from "../constants/APi";
import Sip from "@khateeb00/react-jssip";

const { NotificationManager } = NativeModules;

export const navigateScreen = (nav) => {
  console.log(nav, "dpoaopf");
  navigations = nav;
};

export const checkToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log("fcm_tokennnn", fcmToken);

    setToken(fcmToken);

    return fcmToken;
  }
};

export const showNotification = () => {
  console.log("innotifiiiishaowww");
  messaging().onMessage(async (remoteMessage) => {
    console.log("remoteMegssagetitle", remoteMessage);
    console.log("remoteMegssagebody", remoteMessage?.notification?.body);
    console.log("uniqueIddd22", remoteMessage?.data.participants);
    // showIncVoiceCall(remoteMessage)
    // Check if app is in foreground

    // CustomAlert(remoteMessage);

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

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(
      "Message handled in the background!",
      remoteMessage.data?.notification_type
    );
    // showIncVoiceCall();

    if (remoteMessage?.data?.notification_type == "call") {
      InCallManager.startRingtone();
      setCategories();
      fromInActiveState(remoteMessage);

      // showIncomingCallNotification(remoteMessage);
      // navigations.navigate('IncomingScreen', {
      //   callData: remoteMessage?.data,
      // });
    } else if (remoteMessage?.data?.notification_type == "hangup_call") {
      InCallManager.stopRingtone();
      PushNotification.cancelAllLocalNotifications();
    } else if (remoteMessage?.data?.notification_type === "audio_call") {
      console.log("INActive state====>>>>>");
      showIncVoiceCall(remoteMessage);
    }

    // // Create a notification
    // const notification = new firebase.notifications.Notification()
    //   .setTitle("New Notification Title")
    //   .setBody("New Notification Body")
    //   .setNotificationId("my_notification_id")
    //   .android.setChannelId("my_notification_channel");

    // // Display the notification
    // firebase.notifications().displayNotification(notification);
  });

  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      console.log("initialNotificationsssss====>>>>134", remoteMessage);
      if (remoteMessage?.data?.notification_type === "call") {
        setTimeout(() => {
          navigations.navigate("IncomingScreen", {
            callData: remoteMessage?.data,
          });
        }, 200);
      } else if (remoteMessage?.data?.notification_type === "hangup_call") {
      } else if (remoteMessage?.data?.notification_type === "SINGLE_CHAT") {
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

export const showLocallotification = async (remoteMessage) => {
  console.log("inactiivvv====>>>>>", remoteMessage);

  const channelId = await notifee.createChannel({
    id: "12345",
    name: "Important Notifications",
    importance: 4,
  });
  await notifee.displayNotification({
    title: remoteMessage?.notification?.title,
    body: remoteMessage?.notification?.body,
    id: "12345",
    data: remoteMessage.data,
  });
};

export const configureNotification = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:===>>>>", notification);

      if (notification?.userInteraction && notification?.foreground) {
        mesageViewnavigation();
      }
      if (notification?.data?.data?.notification_type === "SINGLE_CHAT") {
        console.log(
          "inherer--------------------------------22",
          notification?.data?.data?.sid
        );

        navigations.navigate("UserChatsScreen", {
          callData: notification?.data?.data?.sid,
        });
      } else if (
        notification.userInteraction &&
        notification.id === "KILLSTATE"
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
        notification.userInteraction &&
        notification.id === "voicekillstate"
      ) {
        console.log("=====data is coming form");
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

const showIncomingCallNotification = (remoteMessage) => {
  InCallManager.startRingtone();
  PushNotification.localNotification({
    channelId: "12345",
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    smallIcon: null,
    ongoing: true,
    actions: ["Accept", "Reject"],
  });
};

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

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (detail?.pressAction?.id === "decline") {
    rejectCall(callingData);
  } else if (detail?.pressAction?.id === "accept") {
    console.log(callingData,"=========325")
    acceptCall(callingData);
    InCallManager.stopRingtone();
  } 
 
  //  acceptCall(callingData);
    // InCallManager.stopRingtone();

    return;

    // navigations.navigate('CallScreen', {
    //   voiceCall: detail?.notification?.data?.Type == 'A' ? true : false,
    //   fromNotification: true,
    //   callData: detail?.notification?.data?.sender_phone,
    //   meetimgUrl: detail?.notification?.data?.Meeting_url,
    //   fromouter:true
    // });
  //}
});

export const showIncVoiceCall = async (remoteMessage) => {

  console.log(remoteMessage?.from,"=======347")
  const channelId = await notifee.createChannel({
    id: "voicecallBcg",
    name: "Default Channel",
    importance: 4,
  });
  await notifee.displayNotification({
    title: "Incoming Audio Call",
    body: remoteMessage?.from,
    id: "voiceCallNotify",
    // data: {
    //   drName: doctor_name || "Drnewmad",
    //   duration: remaining_seconds,
    //   meetId: video_meet_id,
    // },
    android: {
      category: AndroidCategory.CALL,
     // timeoutAfter: 10000,
      colorized: true,
      //  ongoing:true,
      //  autoCancel:true,
      launchActivity: true,
      channelId,
      // color: AndroidColor.GREEN,
      loopSound: true,
      //  fullScreenAction: { id: "default", launchActivity: "default" },
      fullScreenAction: { id: "default" },
      pressAction: {
        id: "default",
        launchActivity: "default",
      },

      actions: [
        {
          title: '<p style="color: #FFFFFF ">Decline</p>',
          pressAction: { id: "decline" },
        },
        {
          title: '<p style="color: #FFFFFF;">Answer</p>',
          pressAction: { id: "accept", launchActivity: "default" },
        },
      ],
      ongoing: true,
    },

    ios: {
      categoryId: "post",
    },
  });
  await notifee.cancelNotification(channelId);
};

export const showIncVoiceCallInKill = async (remoteMessage) => {
  const channelId = await notifee.createChannel({
    id: "voicecallBcg",
    name: "Default Channel",
    importance: 4,
  });
  await notifee.displayNotification({
    title: "Incoming Audio Call",
    body: remoteMessage?.from,
    id: "voicekillstate",
    // data: {
    //   drName: doctor_name || "Drnewmad",
    //   duration: remaining_seconds,
    //   meetId: video_meet_id,
    // },
    android: {
      category: AndroidCategory.CALL,
      timeoutAfter: 10000,
      colorized: true,
      //  ongoing:true,
      //  autoCancel:true,
      launchActivity: true,
      channelId,
      // color: AndroidColor.GREEN,
      loopSound: true,
      fullScreenAction: { id: "default" },
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
      actions: [
        {
          title: '<p style="color: #FFFFFF ">Decline</p>',
          pressAction: { id: "decline" },
        },
        {
          title: '<p style="color: #FFFFFF;">Answer</p>',
          pressAction: { id: "accept", launchActivity: "default" },
        },
      ],
    },
  });
  await notifee.cancelNotification(channelId);
};

export const sendDataTonofiyHandler = (data) => (callingData = data);

const acceptCall = (call) => {
  console.log(call,"call from 444====>>>>>>>.")
  navigations.navigate("IncomingAudioCall", {
    call: call,
  });

  // const SipCallID = Sip.getFormattedCallId(call);
  // if (SipCallID) {
  //   Sip.answerCall(SipCallID)
  //     .then(() => {
  //       InCallManager.stopRingtone();
  //       navigations.navigate("IncomingScreen", {
  //         callData: call
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("---answerCall-error-incoming---", error);
  //     });
  //   return;
  // }
};

const rejectCall = (call) => {
  const SipCallId = Sip.getFormattedCallId(call);
  if (SipCallId) {
    console.log("SipCallId - if -->");
    InCallManager.stopRingtone();
    Vibration.cancel();
    Sip.declineCall(SipCallId);
    navigations.navigate("Home");
    onSipCallAccepted();
  } else {
    console.log("--Else-SipCallId--");
  }
};
