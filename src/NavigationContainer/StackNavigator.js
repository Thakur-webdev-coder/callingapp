import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import BuyCredit from "../views/BuyCredit/BuyCredit";
import CallingScreen from "../views/CallingScreen/CallingScreen";
import ConfirmationScreen from "../views/ConfirmationScreen/ConfirmationScreen";
import CallRatesScreen from "../views/CallRatesScreen/CallRatesScreen";
import CallReportsScreen from "../views/CallReportsScreen/CallReportsScreen";
import InviteScreen from "../views/InviteScreen/InviteScreen";
import Directory from "../views/SpecialServices/Directory";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
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
    </Stack.Navigator>
  );
};
export default StackNavigator;
