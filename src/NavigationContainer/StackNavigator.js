import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import BuyCredit from "../views/BuyCredit/BuyCredit";
import CallingScreen from "../views/CallingScreen/CallingScreen";
import ConfirmationScreen from "../views/ConfirmationScreen/ConfirmationScreen";
import CallRatesScreen from "../views/CallRatesScreen/CallRatesScreen";
import CallReportsScreen from "../views/CallReportsScreen/CallReportsScreen";
import InviteScreen from "../views/InviteScreen/InviteScreen";
import Directory from "../views/SpecialServices/Directory";
import CallDetailsScreen from "../views/CallDetailsScreen/CallDetailsScreen";
import UserChatsScreen from "../views/UserChatsScreen/UserChatsScreen";
// import StartChatScreen from "../views/startChatScreen/startChatScreen";
import StartChatScreen from "../views/StartChatScreen/StartChatScreen";

import SelectScreen from "../views/SelectScreen/SelectScreen";
import CallScreen from "../views/VoiceCall/VoiceCallScreen";
import WebViewScreen from "../views/webView";
import { participantJoined } from "../lib-jitsi-meet/actions";
import { useDispatch, useSelector } from "react-redux";
import CustomAlert from "../utils/CustomAlertMessage";
import IncomingScreen from "../views/IncomingCallScreen/IncomingScreen";
import TransferHistory from "../views/TransferHistoryScreen/transferHistory";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch();

  const { loginDetails } = useSelector((store) => store.sliceReducer);

  useEffect(() => {
    dispatch(
      participantJoined({
        id: "local",
        name: loginDetails.username,
        local: true,
      })
    );
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="BuyCredit" component={BuyCredit} />

      <Stack.Screen name="CallingScreen" component={CallingScreen} />
      <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
      <Stack.Screen name="CallRatesScreen" component={CallRatesScreen} />
      <Stack.Screen name="CallReportsScreen" component={CallReportsScreen} />
      <Stack.Screen name="InviteScreen" component={InviteScreen} />
      <Stack.Screen name="Directory" component={Directory} />
      <Stack.Screen name="CallDetailsScreen" component={CallDetailsScreen} />
      <Stack.Screen name="UserChatsScreen" component={UserChatsScreen} />
      <Stack.Screen name="startChatScreen" component={StartChatScreen} />
      <Stack.Screen name="SelectScreen" component={SelectScreen} />
      <Stack.Screen name="CallScreen" component={CallScreen} />
      <Stack.Screen name={"WebViewScreen"} component={WebViewScreen} />
      <Stack.Screen name={"IncomingScreen"} component={IncomingScreen} />
      <Stack.Screen name={"TransferHistory"} component={TransferHistory} />
    </Stack.Navigator>
  );
};
export default StackNavigator;
