/**
 * @format
 */
import "./src/lib-jitsi-meet/browser";
import { registerGlobals } from "react-native-webrtc";
registerGlobals();
import {
  Alert,
  AppRegistry,
  NativeModules,
  Platform,
  IntentAndroid,
  Linking,
} from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "./src/redux/store";
import {
  changelCreated,
  configureNotification,
  sendDataTonofiyHandler,
  showNotification,
} from "./src/utils/notificationHandler";

changelCreated();
showNotification();
configureNotification();

AppRegistry.registerComponent(appName, () => App);
