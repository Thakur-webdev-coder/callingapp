import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../assets/colors";
import Home from "../views/HomeScreen/HomeScreen";
import RecentCall from "../views/RecentCallScreen/RecentCallScreen";
import Contacts from "../views/ContactsScreen/ContactScreen";
import LiveChat from "../views/LiveChatScreen/LiveChat";
import Keypad from "../views/KeypadScreen/Keypad";
import IconTab from "../components/IconTab";
import { useDispatch, useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
import { _getloadMoreChatData, _socketConnect } from "../utils/socketManager";
import { getToken } from "../utils/commonUtils";
import { useNavigation } from "@react-navigation/native";
import InCallManager from "react-native-incall-manager";
import { sendDataTonofiyHandler } from "../utils/notificationHandler";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { loginDetails = {} } = useSelector((store) => store.sliceReducer);
  const navigation = useNavigation();

  useEffect(() => {
    const { password, did, username } = loginDetails;
    getToken().then((token) => {
      const param = { id: username, token: token, device: Platform.OS };
      console.log("tokennn", token);
      _socketConnect(param);
    });

    Sip.register({
      websocket: "wss://billing.kokoafone.com:8089/ws",
      username: did + "_web",
      domain: "billing.kokoafone.com",
      password,
      name: did,
    });

    const callReceivedListener = Sip.on("call_received", onSipCallReceived);

    return () => {
      callReceivedListener.remove();
    };
  }, []);

  const onSipCallReceived = (call) => {
    sendDataTonofiyHandler(call);
    InCallManager.startRingtone("_DEFAULT_");
    navigation.navigate("IncomingAudioCall", { call });
  };

  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
          let index;
          if (route.name === "Home") {
            index = 0;
          } else if (route.name === "Recent Call") {
            index = 1;
          } else if (route.name === "Keypad") {
            index = 2;
          } else if (route.name === "Contacts") {
            index = 3;
          } else if (route.name === "Chat") {
            index = 4;
          }

          return (
            <View
              key={route.key}
              style={{
                alignItems: "center",
                paddingTop: hp(3),
                height: hp(10.5),
                paddingBottom: hp(2.5),
              }}
            >
              <IconTab key={route.name} index={index} focused={focused} />
            </View>
          );
        },
        tabBarStyle: {
          backgroundColor: colors.secondary,
          height: hp(10),
          paddingBottom: hp(2),
        },
        tabBarActiveTintColor: colors.buttonColor,
        tabBarInactiveTintColor: colors.white,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={LiveChat} />
      <Tab.Screen name="Keypad" component={Keypad} />
      <Tab.Screen name="Recent Call" component={RecentCall} />
      <Tab.Screen name="Contacts" component={Contacts} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
