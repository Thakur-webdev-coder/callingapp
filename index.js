/**
 * @format
 */
import './src/lib-jitsi-meet/browser';
import { registerGlobals } from 'react-native-webrtc';
registerGlobals();
import {
  Alert,
  AppRegistry,
  NativeModules,
  Platform,
  IntentAndroid,
  Linking,
} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './src/redux/store';
import {
  changelCreated,
  configureNotification,
  showNotification,
} from './src/utils/notificationHandler';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
const { Helpers } = NativeModules;
import InCallManager from 'react-native-incall-manager';

changelCreated();
showNotification();

configureNotification();

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

// AppRegistry.registerComponent(appName, () => App);
