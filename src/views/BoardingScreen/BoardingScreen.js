import { BackHandler, SafeAreaView, View } from "react-native";
import React, { useEffect } from "react";
import CustomImage from "../../components/CustomImage";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { VERIFY_SCREEN } from "../../routes/routeNames";
import AppStyle from "../../components/AppStyle";
import colors from "../../../assets/colors";
import envs from "../../components/config/env";

const BoardingScreen = ({navigation}) => {
  const url = envs;
  // const { navigation } = useNavigation();

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
  //   };
  // }, []);

  // function handleBackButtonClick() {
  //   BackHandler.exitApp()
  //   return true;
  // }

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        <CustomImage
          marginTop={140}
          alignSelf={"center"}
          imgSrc={require("../../../assets/images/logo.png")}
        />
        <CustomButton
          onPress={() => navigation.navigate('UpdateProfile')}
          primary
          title={"Get Started!"}
          horzontalPadding={10}
          marginTop={20}
        />
        <CustomText
          textAlign={"left"}
          marginTop={20}
          horzontalPadding={15}
          alignText={"center"}
          textColor={colors.white}
          text={
            "By signing up, you agree to Terms of Services and Privacy Policy"
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default BoardingScreen;
