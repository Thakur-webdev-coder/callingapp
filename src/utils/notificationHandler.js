import messaging, { firebase } from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { Alert, NativeModules, Platform } from 'react-native';

let navigations = null;
import InCallManager from 'react-native-incall-manager';
import { Store } from '../redux';
import { hangupMeeting } from '../lib-jitsi-meet/actions';
import { setToken } from './commonUtils';
import { Socket } from 'socket.io-client';
import { getSocket } from './socketManager';
import PushNotification, { Importance } from 'react-native-push-notification';

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
  messaging().onMessage(async (remoteMessage) => {
    console.log('remoteMegssage', remoteMessage);
    // Check if app is in foreground

    // CustomAlert(remoteMessage);

    if (remoteMessage?.data?.notification_type == 'hangup_call') {
      console.log('hereeee -->>', remoteMessage?.data);

      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stopRingtone();
      InCallManager.stopRingback();

      Store.dispatch(hangupMeeting());

      navigations.navigate('Home');
    } else if (remoteMessage?.data?.notification_type == 'call') {
      InCallManager.startRingtone();

      navigations.navigate('IncomingScreen', {
        callData: remoteMessage?.data,
      });
    } else if (remoteMessage?.data?.notification_type === 'SINGLE_CHAT') {
      showLocalNotification(remoteMessage);
      // navigations.navigate("UserChatsScreen", {
      //   callData: remoteMessage?.data?.sid,
      // });
    } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
      showLocalNotification(remoteMessage);
    }
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);

    if (remoteMessage?.data?.notification_type == 'call') {
      navigations.navigate('IncomingScreen', {
        callData: remoteMessage?.data,
      });
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
        }, 500);
      } else if (remoteMessage?.data?.notification_type === 'hangup_call') {
      } else if (remoteMessage?.data?.notification_type === 'SINGLE_CHAT') {
        setTimeout(() => {
          navigations.navigate('UserChatsScreen', {
            callData: remoteMessage?.data?.sid,
          });
        }, 500);
      } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
        setTimeout(() => {
          navigations.navigate('UserChatsScreen', {
            groupName: remoteMessage?.data?.group_name,
            uniqueId: remoteMessage?.data?.group_id,
            participants: remoteMessage?.data?.participants,
          });
        }, 500);
      }
    });

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('hererrerererNotiitiitit');
    if (remoteMessage?.data?.notification_type == 'call') {
      console.log('notification opened', remoteMessage);
      navigations.navigate('IncomingScreen', {
        callData: remoteMessage?.data,
      });
    } else if (remoteMessage?.data?.notification_type === 'SINGLE_CHAT') {
      navigations.navigate('UserChatsScreen', {
        callData: remoteMessage?.data?.sid,
      });
    } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
      navigations.navigate('UserChatsScreen', {
        groupName: remoteMessage?.data?.group_name,
        uniqueId: remoteMessage?.data?.group_id,
        participants: remoteMessage?.data?.participants,
      });
    }
  });
};

const showLocalNotification = (remoteMessage) => {
  PushNotification.localNotification({
    title: remoteMessage?.notification?.title,
    message: remoteMessage?.notification?.body,
    playSound: true,
    soundName: 'default',
    importance: Importance.HIGH,
    id: '12345',
    data: remoteMessage,
  });
};

export const configureNotification = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log(
        'NOTIFICATION:===>>>>',
        notification,
        notification?.data?.data?.notification_type === 'SINGLE_CHAT'
      );

      if (notification?.data?.data?.notification_type === 'SINGLE_CHAT') {
        navigations.navigate('UserChatsScreen', {
          callData: notification?.data?.data?.sid,
        });
      } else if (notification?.data?.data?.notification_type === 'GROUP_CHAT') {
        navigations.navigate('UserChatsScreen', {
          groupName: notification?.data?.data?.group_name,
          uniqueId: notification?.data?.data?.group_id,
          participants: notification?.data?.data?.participants,
        });
      }
    },
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
