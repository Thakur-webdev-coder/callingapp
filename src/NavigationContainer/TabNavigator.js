import React, { useEffect } from "react";
import { View } from "react-native";
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
import { useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { loginDetails = {} } = useSelector((store) => store);

  useEffect(() => {
    const { password, username } = loginDetails;

    Sip.register({
      websocket: "wss://billing.hifroggy.com:8089/ws",
      username,
      domain: "billing.hifroggy.com",
      password,
      name: username,
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: "below-icon",

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
          } else if (route.name === "LiveChat") {
            index = 4;
          }

          return (
            <View
              key={route.key}
              style={{
                alignItems: "center",
                paddingTop: hp(3),
                paddingBottom: hp(2.5),
              }}
            >
              <IconTab key={route.name} index={index} focused={focused} />
            </View>
          );
        },
        tabBarStyle: {
          backgroundColor: colors.appColor,
          borderTopColor: colors.bordercolor,
          borderTopWidth: wp(0.2),
          height: hp(9),
          paddingBottom: hp(0.8),
        },
        tabBarActiveTintColor: colors.tabTextColor,
        tabBarInactiveTintColor: colors.tabTextColor,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Recent Call" component={RecentCall} />
      <Tab.Screen name="Keypad" component={Keypad} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="LiveChat" component={LiveChat} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
