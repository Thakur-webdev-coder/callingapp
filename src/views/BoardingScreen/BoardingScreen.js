import { PermissionsAndroid, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomImage from "../../components/CustomImage";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { VERIFY_SCREEN } from "../../routes/routeNames";
import AppStyle from "../../components/AppStyle";
import colors from "../../../assets/colors";
import { ic_app_logo } from "../../routes/imageRoutes";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CheckBox from "@react-native-community/checkbox";
import { Show_Toast } from "../../utils/toast";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

const BoardingScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);

  const permissions = PERMISSIONS.ANDROID.ACCESS_NOTIFICATION_POLICY;

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const checkPeermission = () => {
    request(permissions)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            Show_Toast("This feature is not available on this device ");
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable",
              RESULTS.DENIED
            );
            Show_Toast("Permission denied ");
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("granted");

            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            Show_Toast("Please allow contact permission from settings");

            break;
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  async function requestNotificationPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_WAP_PUSH,
          {
            title: "Notification Permission",
            message: "Allow this app to send you notifications?",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Notification permission granted");
        } else {
          console.log("Notification permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  // async function requestNotificationPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECEIVE_BOOT_COMPLETED,
  //       {
  //         title: "My App Notification Permission",
  //         message: "My App needs permission to show notifications.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK",
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("Notification permission granted");
  //     } else {
  //       Show_Toast("Permission Denied");
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //   }
  // }

  // async function requestNotificationPermission() {
  //   if (Platform.OS === "android") {
  //     const result = await request(
  //       PERMISSIONS.ANDROID.ACCESS_NOTIFICATION_POLICY
  //     );
  //     if (result === "granted") {
  //       console.log("Notification permission granted");
  //     }
  //   } else if (Platform.OS === "ios") {
  //     const result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
  //     if (result === "granted") {
  //       console.log("Notification permission granted");
  //     }
  //   }
  // }

  return (
    <SafeAreaView style={[AppStyle.wrapper,{backgroundColor:colors.white}]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomImage alignSelf={"center"} imgSrc={ic_app_logo} />
      </View>

      <View>
        <CustomButton
          onPress={() => navigation.navigate("Login")}
          primary
          title={"Get Started"}
          horzontalPadding={wp(15)}
          marginTop={20}
        />

        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginBottom: hp(5),
          }}
        >
          <CheckBox
            disabled={false}
            value={checked}
            onValueChange={(newValue) => setChecked(newValue)}
            tintColors={{ true: colors.buttonColor, false: colors.grayColor }}
          />

          <Text
            style={{
              color: colors.grayColor,
              alignSelf: "center",
            }}
          >
            Agree to{" "}
            <Text style={{ color: colors.buttonColor }}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BoardingScreen;
