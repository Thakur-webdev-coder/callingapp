import { View, SafeAreaView, Share } from "react-native";
import React from "react";
import CustomImage from "../../components/CustomImage";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";

import { ic_invite } from "../../routes/imageRoutes";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";
import styles from "./styles";
import { CommonHeader } from "../../components";

const InviteScreen = () => {
  const shareLink = async () => {
    try {
      const result = await Share.share({
        message:
          "Join me on Froggy, download Froggy app https://play.google.com/store/apps/details?id=com.froggy",
      });
      if (result.action === Share.sharedAction) {
        console.log("Invited successfully");
      } else if (result.action === Share.dismissedAction) {
        console.log("Invitation failed");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <CommonHeader paddingHorizontal={18} />
      <View style={styles.tansparentView}>
        <CustomImage
          imgSrc={ic_invite}
          alignSelf={"center"}
          marginTop={hp(15)}
        />
        <CustomText
          text={"Invite your friend"}
          textColor={colors.white}
          textSize={20}
          textAlign={"center"}
          marginTop={hp(10)}
        />

        <View style={styles.inviteText}>
          <CustomText
            text={
              "Join me on Froggy, download Froggy app https://play.google.com/store/apps/details?id=com.froggy"
            }
            textColor={colors.white}
            horzontalPadding={10}
            paddingVertical={10}
          />
        </View>

        <CustomButton
          title={"Invite Friends"}
          primary
          marginTop={hp(5)}
          horzontalPadding={wp(15)}
          onPress={() => shareLink()}
        />
      </View>
    </SafeAreaView>
  );
};

export default InviteScreen;
