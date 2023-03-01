import { SafeAreaView, TouchableOpacity, View,Text } from "react-native";
import React from "react";
import AppStyle from "../../components/AppStyle";
import CustomImage from "../../components/CustomImage";
import { ic_confirm, logo_smallfrog } from "../../routes/imageRoutes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomText from "../../components/CustomText";

import colors from "../../../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { CommonHeader } from "../../components";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";

const ConfirmationScreen = () => {
  const { navigate } = useNavigation();
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>

        <CommonHeader
          headerText={"Confirmation"}
        />

        <CustomImage
          imgSrc={logo_smallfrog}
          alignSelf={"center"}
          marginTop={hp(5)}
        />

        <CustomImage imgSrc={ic_confirm} alignSelf={"center"} marginTop={10} />

        <CustomText
          text={"Top Up Success"}
          alignText={"center"}
          marginTop={25}
          textSize={18}
          textColor={colors.white}
        />

        <CustomText
          text={"Your top up has been successfully done"}
          textSize={16}
          marginTop={25}
          textColor={colors.darkGreenText}
          textAlign={"center"}
          fontWeight={"bold"}
        />

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[colors.darkGreenUp, colors.darkGreenMid, colors.darkGreenMid]}
        style={styles.linearGradientStyle}
      >
        <TouchableOpacity onPress={() => navigate("BuyCredit")}>
          <Text style={styles.buttonTextStyle}>Done</Text>
        </TouchableOpacity>
      </LinearGradient>

        <CustomText
          text={"€50.00"}
          alignText={"center"}
          marginTop={30}
          textSize={28}
          textColor={colors.darkGreenText}
          fontWeight={"bold"}
        />
       
        <TouchableOpacity onPress={() => navigate("BuyCredit")}>
          <CustomText
            text={"Top Up More Money"}
            textColor={colors.darkGreenText}
            alignText={"center"}
            marginTop={hp(10)}
            textSize={16}
            fontWeight={"bold"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmationScreen;
