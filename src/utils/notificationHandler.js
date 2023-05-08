import messaging, { firebase } from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { Alert, NativeModules, Platform } from 'react-native';

let navigations = null;
import InCallManager from 'react-native-incall-manager';
import { Store } from '../redux';
import { hangupMeeting } from '../lib-jitsi-meet/actions';
import { getBooleanValue, setToken } from './commonUtils';
import { Socket } from 'socket.io-client';
import { getSocket } from './socketManager';
import PushNotification, { Importance } from 'react-native-push-notification';
import Loading from 'react-native-whc-loading';

const { NotificationManager } = NativeModules;

export const navigateScreen = (nav) => {
  console.log(nav, 'dpoaopf');
  navigations = nav;
};

export const checkToken = async () => {
  firebase
  .messaging()
  .hasPermission()
  .then(enabled => {
    if (enabled) {
      console.log('askpermission---hasPermission------',enabled);
      // User has permissions
      getFcmToken(); // const fcmToken = await firebase.messaging().getToken();
    } else {
      // User doesn't have permission
      firebase
        .messaging()
        .requestPermission()
        .then(() => {
          console.log('askpermission---requestPermission------',enabled);

          // User has authorized
          getFcmToken(); // const fcmToken = await firebase.messaging().getToken();
        })
        .catch(error => {
          // User has rejected permissions
          console.log(
            'PERMISSION REQUEST :: notification permission rejected',
          );
        });
    }
  }) .catch(error => {
    // User has rejected permissions
    console.log(
      'error----',error
    );
  });
 
};
const getFcmToken =async()=>{
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('fcm_tokennnn', fcmToken);

    setToken(fcmToken);

    return fcmToken;
  }
}

export const showNotification = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('remoteMegssage', remoteMessage);
    console.log('uniqueIddd22', remoteMessage?.data.participants);

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
      const isFocused = getBooleanValue('isFocused').then((data) => {
        console.log('isFocused', data);

        if (!data) {
          showLocalNotification(remoteMessage);
        }
      });
    } else if (remoteMessage?.data?.notification_type === 'GROUP_CHAT') {
      const isFocused = getBooleanValue('isFocused').then((data) => {
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
      showIncomingCallNotification(remoteMessage);
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
  PushNotification.configure({
    onNotification: function (notification) {
      console.log(
        'NOTIFICATION:===>>>>',
        notification?.action,
        notification?.data?.data?.notification_type === 'SINGLE_CHAT'
      );

      if (notification?.data?.data?.notification_type === 'SINGLE_CHAT') {
        navigations.navigate('UserChatsScreen', {
          callData: notification?.data?.data?.sid,
        });
      } else if (notification?.data?.data?.notification_type === 'GROUP_CHAT') {
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
