/**
 * @format
 */
import "./src/lib-jitsi-meet/browser";
import { registerGlobals } from "react-native-webrtc";
registerGlobals();
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "./src/redux/store";
import { configureNotification } from "./src/utils/notificationHandler";

configureNotification();
AppRegistry.registerComponent(appName, () => App);
