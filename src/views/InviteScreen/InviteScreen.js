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
import AppStyle from "../../components/AppStyle";

const InviteScreen = ({navigation}) => {
  const shareLink = async () => {
    try {
      const result = await Share.share({
        message:
          "Join me on ngvoice, download ngvoice app https://play.google.com/store/apps/details?id=com.ngvoice",
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
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.homeMainView}>
      <CommonHeader 
      headerText={"Invite Friend"}
       paddingHorizontal={18}
       onPress={() => navigation.goBack()}
        />
      <CustomImage imgSrc={ic_invite} alignSelf={"center"} marginTop={hp(15)} />
      <CustomText
        text={"Invite your friend"}
        textColor={colors.black}
        textSize={20}
        textAlign={"center"}
        marginTop={hp(10)}
      />

      <View style={styles.inviteText}>
        <CustomText
          text={
            "Join me on NG Voice, download NG Voice app https://play.google.com/store/apps/details?id=com.ngvoice"
          }
          textColor={colors.black}
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
