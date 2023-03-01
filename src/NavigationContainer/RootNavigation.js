import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StackNavigator from "./StackNavigator";
import {
  BOARDING_SCREEN,
  OTP_SCREEN,
  VERIFY_SCREEN,
} from "../routes/routeNames";
import BoardingScreen from "../views/BoardingScreen/BoardingScreen";
import VerificationScreen from "../views/VerficationSCreen/VerificationScreen";
import OtpScreen from "../views/OtpScreen/OtpScreen";
import { useSelector } from "react-redux";
import WebViewScreen from "../views/webView";
import Loading from "react-native-whc-loading";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
 //const asa= useSelector((store) => store);
  // const { loginDetails,isLoadingEnable } = useSelector((store) => store.reducer);
  const { loginDetails,isLoadingEnable } = useSelector((store) => store);

  console.log('qwe---',loginDetails,isLoadingEnable)
  return (
    <>
    <Stack.Navigator
       initialRouteName={loginDetails != null ? "StackNavigator" : BOARDING_SCREEN}
      //initialRouteName={ StackNavigator}

      // initialRouteName={
      //   loginDetails != null ? "StackNavigator" : BOARDING_SCREEN
      // }
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StackNavigator" component={StackNavigator} />
      <Stack.Screen name={BOARDING_SCREEN} component={BoardingScreen} />
      <Stack.Screen name={VERIFY_SCREEN} component={VerificationScreen} />
      <Stack.Screen name={OTP_SCREEN} component={OtpScreen} />
      <Stack.Screen name={"WebViewScreen"} component={WebViewScreen} />
    </Stack.Navigator>
    <Loading
        
        loading={isLoadingEnable}
      />
      </>
  );

};
export default RootNavigation;
