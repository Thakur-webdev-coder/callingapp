import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import Loading from "react-native-whc-loading";
import Login from "../views/LoginSignupScreen/Login";
import UpdateProfile from "../views/UpdateProfileScreen/UpdateProfile";
import DIDScreen from "../views/DIDScreen/DIDScreen";
import { participantJoined } from "../lib-jitsi-meet/actions";
import WebViewScreen from "../views/webView";
import { hitHiddenPageApi } from "../constants/APi";
import { setSaveStatus } from "../redux/reducer";
import ExistingUserLoginScreen from "../views/LoginExistingUserScreen/ExistingUserLoginScreen";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    hitHiddenPageApiMethod()
  }, []);

  const hitHiddenPageApiMethod = () => {
    hitHiddenPageApi()
      .then((response) => {
        console.log('hitHiddenPageApiMethod---------', response);
        dispatch(setSaveStatus(response?.data?.status))
        // setState({hiddenStatus:response?.data?.status})
      })
      .catch((err) => {
        console.log('err-------', err);
      });
  };
  const { loginDetails, isLoadingEnable } = useSelector(
    (store) => store.sliceReducer
  );

  return (
    <>
      <Stack.Navigator
        initialRouteName={
          loginDetails ? "StackNavigator" : BOARDING_SCREEN
        }
        // initialRouteName={OTP_SCREEN}
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="StackNavigator" component={StackNavigator} />
        <Stack.Screen name={BOARDING_SCREEN} component={BoardingScreen} />
        <Stack.Screen name={"Login"} component={Login} />
        <Stack.Screen name={"UpdateProfile"} component={UpdateProfile} />
        <Stack.Screen name={"DIDScreen"} component={DIDScreen} />
        <Stack.Screen name={VERIFY_SCREEN} component={VerificationScreen} />
        <Stack.Screen name={OTP_SCREEN} initialParams={{}} component={OtpScreen} />
        <Stack.Screen name={"ExistingUserLoginScreen"} component={ExistingUserLoginScreen} />

        <Stack.Screen name={"WebViewScreen"} component={WebViewScreen} />
      </Stack.Navigator>
      <Loading loading={isLoadingEnable} />
    </>
  );
};
export default RootNavigation;
