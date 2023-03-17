import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import AppStyle from "../../components/AppStyle";
import { CommonHeader } from "../../components";
import styles from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text } from "react-native";
import colors from "../../../assets/colors";
import LinearGradient from "react-native-linear-gradient";
import { ic_add, ic_back, ic_brownArrow, ic_callAvatar, ic_camera_off, ic_camera_switch, ic_contact_avatar, ic_endcall, ic_msg, ic_mute_call, ic_speaker_small } from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
const CallScreen = ({ navigation, route }) => {
  const { voiceCall } = route.params
  console.log('rouuu---', voiceCall)
  return (
    <SafeAreaView style={voiceCall ? AppStyle.wrapper : styles.wrapper}>
      <View style={{ flex: 4 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}
          style={styles.backArrowBox} >
          <Image source={voiceCall ? ic_brownArrow : ic_back} />
        </TouchableOpacity>

        <CustomText
          textColor={voiceCall ? colors.black : colors.white}
          text={'918800810156'}
          alignText={"center"}
          textSize={20}
          marginTop={hp(5)}
          fontWeight={'500'}
        />
        <CustomText
          textColor={voiceCall ? colors.black : colors.white}
          text={'Calling...'}
          alignText={"center"}
          textSize={12}
          marginTop={hp(1)}
          fontWeight={'400'}
        />


        <Image style={voiceCall ? styles.avatarStyle : styles.videoStyle}
          source={voiceCall ? ic_callAvatar : { uri: "https://png.pngtree.com/background/20220726/original/pngtree-smiling-woman-having-conference-video-call-picture-image_1810453.jpg" }} />

      </View>

      <View style={styles.bottomStyle}>
        <Image
          source={ic_msg}
          style={styles.avatarStyle} />
        <Image
          source={ic_speaker_small}
          style={styles.avatarStyle} />
        {!voiceCall ?
          <Image
            source={ic_camera_switch}
            style={styles.avatarStyle} />
          : null}
        <Image
          source={ic_endcall}
          style={styles.avatarStyle} />
        {!voiceCall ? <Image
          source={ic_camera_off}
          style={styles.avatarStyle} />
          : null}
        <Image
          source={ic_mute_call}
          style={styles.avatarStyle} />
      </View>
    </SafeAreaView>
  )
}
export default CallScreen;
