import { SafeAreaView, Text, View } from "react-native";
import React, { useState } from "react";
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

const BoardingScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);

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
