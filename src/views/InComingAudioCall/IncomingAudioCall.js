import { View, Text, Image, TouchableOpacity, Vibration } from "react-native";
import React, { useEffect } from "react";
import { ic_avatar, ic_callrecive, ic_endcall } from "../../routes/imageRoutes";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../assets/colors";
import InCallManager from "react-native-incall-manager";
import LinearGradient from "react-native-linear-gradient";
import Sip from "@khateeb00/react-jssip";

const IncomingAudioCall = ({ navigation, route }) => {
  const call = route.params.call;
  const callerExtention = Sip.getRemoteNumber(Sip.ActiveCallId);
  const callerName = Sip.getRemoteDisplayName(Sip.ActiveCallId);

  console.log("this is incoming acall ", call);

  const acceptCall = () => {
    console.log(call, "=====ddddddddd");
    const SipCallID = Sip.getFormattedCallId(call);

    if (SipCallID) {
      Sip.answerCall(SipCallID)
        .then(() => {
          InCallManager.stopRingtone();
          navigation.navigate("CallingScreen", {
            callData: call._remote_identity._display_name,
          });
        })
        .catch((error) => {
          console.log("---answerCall-error-incoming---", error);
        });
      return;
    }
  };

  useEffect(() => {
    const callReceivedListener = Sip.on("call_received", onSipCallReceived);
    const callTerminatedListener = Sip.on(
      "call_terminated",
      onSipCallTerminated
    );
    const callAcceptedListener = Sip.on("call_accepted", onSipCallAccepted);
    return () => {
      callReceivedListener.remove();
      callTerminatedListener.remove();
      callAcceptedListener.remove();
    };
  }, []);

  const onSipCallReceived = () => {
    console.log("startringtone");
    InCallManager.startRingtone("_DEFAULT_");
    Vibration.vibrate([400, 600], true);
  };
  const rejectCall = () => {
    const SipCallId = Sip.getFormattedCallId(call);
    if (SipCallId) {
      console.log("SipCallId - if -->");
      InCallManager.stopRingtone();
      Vibration.cancel();
      Sip.declineCall(SipCallId);
      navigation.navigate("Home");
      onSipCallAccepted();
    } else {
      console.log("--Else-SipCallId--");
    }
  };

  const onSipCallAccepted = () => {
    console.log("onSipCallAccepted ->");
    InCallManager.stopRingback();
    InCallManager.stopRingtone();
    Vibration.cancel();
  };

  const onSipCallTerminated = () => {
    console.log("terminated ->");
    InCallManager.stopRingtone();
    Vibration.cancel();
    navigation.navigate("Home");
  };

  return (
    <View>
      <Text
        style={{
          color: colors.black,
          alignSelf: "center",
          marginTop: hp(12),
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Test
        {/* {notificationData?.Subject} */}
      </Text>
      <Image
        source={ic_avatar}
        style={{ alignSelf: "center", marginTop: hp(3) }}
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
        {callerName || callerExtention || "Unknown"}
        {/* {notificationData?.sender_phone} */}
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
          marginTop: hp(20),
          paddingBottom: hp(5),
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

export default IncomingAudioCall;
