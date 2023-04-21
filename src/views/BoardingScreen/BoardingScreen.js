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

  const permissions = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

  useEffect(() => {
    checkPeermission();
  }, []);

  const checkPeermission = () => {
    request(permissions)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
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
            Show_Toast("Please allow notification permission from settings");

            break;
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
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
