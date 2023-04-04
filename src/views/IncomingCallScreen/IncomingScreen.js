import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ic_avatar, ic_callrecive, ic_endcall } from "../../routes/imageRoutes";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../assets/colors";
import InCallManager from "react-native-incall-manager";
import LinearGradient from "react-native-linear-gradient";
import { hithangUpCallApi } from "../../constants/APi";
import { hangupMeeting } from "../../lib-jitsi-meet/actions";

const IncomingScreen = ({ navigation, route }) => {
  const notificationData = route.params.callData;

  const acceptCall = () => {
    InCallManager.stopRingtone();
    navigation.navigate("CallScreen", {
      voiceCall: notificationData?.Type == "A" ? true : false,
      fromNotification: true,
      callData: notificationData?.sender_phone,
    });
  };

  const rejectCall = () => {
    InCallManager.stopRingtone();
    hitHanupCall();
    navigation.goBack();
  };

  const hitHanupCall = async () => {
    const data = new FormData();
    data.append("receiver_number", notificationData?.sender_phone);

    console.log("data -->", data);
    hithangUpCallApi(data).then((response) => {
      Store.dispatch(hangupMeeting());
    });
  };
  return (
    <View>
      <Image
        source={ic_avatar}
        style={{ alignSelf: "center", marginTop: hp(15) }}
      />
      <Text
        style={{
          color: colors.black,
          alignSelf: "center",
          marginTop: hp(3),
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {notificationData?.sender_phone}
      </Text>

      <Text
        style={{
          color: colors.black,
          alignSelf: "center",
          marginTop: hp(1),
        }}
      >
        is Calling..
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: hp(30),
        }}
      >
        <TouchableOpacity onPress={() => acceptCall()}>
          <LinearGradient
            colors={[colors.greenTop, colors.greenMid, colors.greenMid]}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              backgroundColor: "green",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={ic_callrecive} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => rejectCall()}>
          <Image source={ic_endcall} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingScreen;
