import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import styles from "./styles";
import { ic_app_logo } from "../../routes/imageRoutes";
import CustomImage from "../../components/CustomImage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomText from "../../components/CustomText";
import colors from "../../../assets/colors";
import CustomButton from "../../components/CustomButton";
import { VERIFY_SCREEN } from "../../routes/routeNames";
import LinearGradient from "react-native-linear-gradient";

const Login = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={{ flex: 1 }}>
        <CustomImage
          alignSelf={"center"}
          marginTop={wp(20)}
          imgSrc={ic_app_logo}
        />
      </View>
      <View style={styles.wrapper2}>
      <LinearGradient
      colors={['#FD2A46', '#F8B502']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}>
        <CustomText
          text={"Login / Signup"}
          textColor={colors.white}
          textSize={37}
          fontWeight={"bold"}
          alignText={"center"}
          marginTop={hp(10)}
        />
        <CustomText
          text={"Use Phone Number to Login or Signup"}
          textColor={colors.white}
          textSize={20}
          fontWeight={"bold"}
          alignText={"center"}
          marginTop={hp(5)}
        />

        <CustomButton
        title={"Continue"}
        // primary
        icon
        horzontalPadding={wp(15)}
        marginTop={hp(5)}
        onPress={() => navigation.navigate(VERIFY_SCREEN)}
      />

        {/*<CustomButton
          title={"Existing User Login"}
          primary
          horzontalPadding={wp(15)}
          marginTop={hp(1)}
          onPress={() => navigation.navigate("ExistingUserLoginScreen")}
  />*/}
  </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default Login;
