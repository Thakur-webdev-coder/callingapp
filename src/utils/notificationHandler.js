import messaging, { firebase } from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { Alert, NativeModules, Platform } from 'react-native';

let navigations = null;
import InCallManager from 'react-native-incall-manager';
import { Store } from '../redux';
import { hangupMeeting } from '../lib-jitsi-meet/actions';
import { fromInActiveState, getBooleanValue, setToken } from './commonUtils';
import { Socket } from 'socket.io-client';
import { getSocket } from './socketManager';
import PushNotification, { Importance } from 'react-native-push-notification';
import Loading from 'react-native-whc-loading';
let myMesaggeNotification = null;
import notifee from '@notifee/react-native';
import { hithangUpCallApi } from '../constants/APi';



const { NotificationManager } = NativeModules;

export const navigateScreen = (nav) => {
  console.log(nav, 'dpoaopf');
  navigations = nav;
};

export const checkToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('fcm_tokennnn', fcmToken);

    setToken(fcmToken);

    return fcmToken;
  }
};

export const showNotification = () => {
  console.log('innotifiiiishaowww');
  messaging().onMessage(async (remoteMessage) => {
    console.log('remoteMegssagetitle', remoteMessage);
    console.log('remoteMegssagebody', remoteMessage?.notification?.body);
    console.log('uniqueIddd22', remoteMessage?.data.participants);

    // Check if app is in foreground

    // CustomAlert(remoteMessage);

    myMesaggeNotification = remoteMessage;

    if (remoteMessage?.data?.notification_type == 'hangup_call') {
      console.log('hereeee -->>', remoteMessage?.data);

      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stopRingtone();
      InCallManager.stopRingback();

      Store.dispatch(hangupMeeting());

      navigations.navigate('Home');
    } else if (remoteMessage?.data?.notification_type == 'call') {
      console.log('callll====s');
      InCallManager.startRingtone();

      navigations.navigate('IncomingScreen', {
        callData: remoteMessage?.data,
      });
    } else if (remoteMessage?.data?.notification_type === 'SINGLE_CHAT') {
      console.log('insinglechat');
       getBooleanValue('isFocused').then((data) => {
        console.log('isFocused', data);

        if (!data) {
          console.log("i'm herer", remoteMessage);
          showLocalNotification(remoteMessage);
        }
      });
    } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
     getBooleanValue('isFocused').then((data) => {
        console.log('isFocused', data);

        if (!data) {
          showLocalNotification(remoteMessage);
        }
      });
    }
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
   
    if (remoteMessage?.data?.notification_type == 'call') {
      console.log('Message handled in the background!3333333333333s', remoteMessage);
      InCallManager.startRingtone()
      fromInActiveState(remoteMessage)
      
      // showIncomingCallNotification(remoteMessage);
      // navigations.navigate('IncomingScreen', {
      //   callData: remoteMessage?.data,
      // });
    } else if (remoteMessage?.data?.notification_type == 'hangup_call') {
      InCallManager.stopRingtone();
      PushNotification.cancelAllLocalNotifications();
      
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
      console.log('initialNotification', remoteMessage);
      if (remoteMessage?.data?.notification_type === 'call') {
        setTimeout(() => {
          navigations.navigate('IncomingScreen', {
            callData: remoteMessage?.data,
          });
        }, 200);
      } else if (remoteMessage?.data?.notification_type === 'hangup_call') {
      } else if (remoteMessage?.data?.notification_type === 'SINGLE_CHAT') {
        setTimeout(() => {
          navigations.navigate('UserChatsScreen', {
            callData: remoteMessage?.data?.sid,
          });
        }, 200);
      } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
        setTimeout(() => {
          let participants = remoteMessage?.data?.participants;

          let result = participants.split(',').map(function (value) {
            return value.trim();
          });
          navigations.navigate('UserChatsScreen', {
            groupName: remoteMessage?.data?.group_name,
            uniqueId: remoteMessage?.data?.group_id,
            participants: result,
          });
        }, 200);
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log("abcdefghi=============",detail);
      
      if (detail?.pressAction?.id === "decline") {
       
        InCallManager.stopRingtone();
        const data = new FormData();
    data.append("receiver_number", detail.notification?.data?.sender_phone);

    console.log("data -->", data);
    hithangUpCallApi(data).then((response) => {
      Store.dispatch(hangupMeeting());
    });
       
      
      }
     
    });

    

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('hererrerererNotiitiitit');

   
    if (remoteMessage?.data?.notification_type == 'call') {
      console.log('notification opened', remoteMessage);
      navigations.navigate('IncomingScreen', {
        callData: remoteMessage?.data,
      });
    }
     else if (remoteMessage?.data?.notification_type === 'SINGLE_CHAT') {
      console.log('hererrerererNotiitiitit----------');
      navigations.navigate('UserChatsScreen', {
        callData: remoteMessage?.data?.sid,
      });
    } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
      let participants = remoteMessage?.data?.participants;

      let result = participants.split(',').map(function (value) {
        return value.trim();
      });
      navigations.navigate('UserChatsScreen', {
        groupName: remoteMessage?.data?.group_name,
        uniqueId: remoteMessage?.data?.group_id,
        participants: result,
      });
    }
  });
};


const mesageViewnavigation = () => {
   if (myMesaggeNotification?.data?.notification_type === 'SINGLE_CHAT') {
    navigations.navigate('UserChatsScreen', {
      callData: myMesaggeNotification?.data?.sid,
    });
   
 } else if (myMesaggeNotification?.data?.notification_type === 'GROUP_CHAT') {
  let participants = myMesaggeNotification?.data?.participants;

      let result = participants.split(',').map(function (value) {
        return value.trim();
      });
      navigations.navigate('UserChatsScreen', {
        groupName: myMesaggeNotification?.data?.group_name,
        uniqueId: myMesaggeNotification?.data?.group_id,
        participants: result,
      });
 
 }
};

const showLocalNotification = (remoteMessage) => {
  PushNotification.localNotification({
    title: remoteMessage?.notification?.title,
    message: remoteMessage?.notification?.body,
    playSound: true,
    soundName: 'default',
    importance: Importance.HIGH,
    id: '12345',
    channelId: '12345',
    data: remoteMessage,
  });
};

export const configureNotification = () => {
  console.log('inherererrerer====');
  PushNotification.configure({
    onNotification: function (notification) {
      console.log(
        'NOTIFICATION:===>>>>',
        notification,
        notification?.data?.data?.notification_type === 'SINGLE_CHAT'
      );

      if (notification?.userInteraction && notification?.foreground) {
        mesageViewnavigation();
      }

      if (notification?.data?.data?.notification_type === 'SINGLE_CHAT') {
        navigations.navigate('UserChatsScreen', {
          callData: notification?.data?.data?.sid,
        });
      } else if(notification.userInteraction && notification.id === "KILLSTATE" ){
        setTimeout(() => {
        InCallManager.stopRingtone();
          navigations.navigate("CallScreen", {
            voiceCall: notification?.data?.Type == "A" ? true : false,
            fromNotification: true,
            callData: notification?.data?.sender_phone,
            meetimgUrl: notification?.data?.Meeting_url,
          });
        }, 200)
      }
      
      else if (notification?.data?.data?.notification_type === 'GROUP_CHAT') {
        let participants = notification?.data?.data?.participants;

        let result = participants.split(',').map(function (value) {
          return value.trim();
        });
        navigations.navigate('UserChatsScreen', {
          groupName: notification?.data?.data?.group_name,
          uniqueId: notification?.data?.data?.group_id,
          participants: result,
        });
      } else if (notification?.data?.data?.notification_type === 'call') {

       
        if (notification.userInteraction) {
          console.log('acccept Clciked', notification.action);
          if (notification.action == 'Accept') {
            InCallManager.stopRingtone();
            navigations.navigate('CallScreen', {
              voiceCall: notification?.data?.data?.Type == 'A' ? true : false,
              fromNotification: true,
              callData: notification?.data?.data?.sender_phone,
              meetimgUrl: notification?.data?.data?.Meeting_url,
            });
          } else if (notification.action == 'Reject') {
            console.log('User pressed Reject button on the notification!');
          }
        }
      }
    },

    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },
  });
};

const showIncomingCallNotification = (remoteMessage) => {
  InCallManager.startRingtone();
  PushNotification.localNotification({
    channelId: '12345',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    smallIcon: null,
    ongoing: true,
    actions: ['Accept', 'Reject'],
  });
};

export const changelCreated = () => {
  PushNotification.createChannel({
    channelId: '12345', // (required)
    channelName: 'My channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  });
};



