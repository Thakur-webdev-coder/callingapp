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
import { useDispatch, useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
import { _getloadMoreChatData, _socketConnect } from "../utils/socketManager";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { loginDetails = {}, encrypt_detail = {} } = useSelector(
    (store) => store.sliceReducer
  );
  const dispatch = useDispatch();

  const { encryptPassword, encryptUser } = encrypt_detail;

  useEffect(() => {
    const { password, did, username } = loginDetails;
    const param = { id: username };

    Sip.register({
      websocket: "wss://billing.kokoafone.com:8089/ws",
      username: did + "_web",
      domain: "billing.kokoafone.com",
      password,
      name: did,
    });
    _socketConnect(param);
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
          } else if (route.name === "Chat") {
            index = 4;
          }

          return (
            <View
              key={route.key}
              // onStartShouldSetResponder={()=>{        //needed comment
              //   if(route.name === "LiveChat"){
              //     Linking.openURL('https://tawk.to/chat/63de1f18c2f1ac1e20315d9d/1godqiuj4')
              //     return true
              //   }
              //   return false
              // }}
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
          backgroundColor: colors.secondary,
          // borderTopColor: colors.bordercolor,
          // borderTopWidth: wp(0.2),
          height: hp(9),
          paddingBottom: hp(0.8),
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
