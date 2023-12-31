import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AppStyle from "../../components/AppStyle";
import CustomImage from "../../components/CustomImage";
import {
  ic_endcall,
  ic_speaker,
  ic_speaker_fill,
  ic_pause_fill,
  ic_pause,
  ic_mic,
  ic_mic_fill,
  ic_avatar,
} from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import styles from "./styles";
import colors from "../../../assets/colors";
import { useDispatch, useSelector } from "react-redux";

import Sip from "@khateeb00/react-jssip";
import { secondsToHMS } from "../../utils/commonUtils";

import InCallManager from "react-native-incall-manager";
import postFormData, {
  hitJoinVideoCallApi,
  hitVoiceNotificationApi,
} from "../../constants/APi";

let isCallGoing = null;

const CallingScreen = ({ navigation, route }) => {
  // const [state, setState] = useState({
  //   timerCount: 0,
  // });

  const [timerCount, setTimerCount] = useState(0);
  const [mute, setMute] = useState(false);
  const [hold, setHold] = useState(false);
  const [mySpeaker, setSpeaker] = useState(false);
  const { callData, avatarImg } = route.params || {};
  const { loginDetails = {} } = useSelector((store) => store.sliceReducer);
  const { username } = loginDetails;
  // console.log("route.params---->", route.params);
  useEffect(() => {
    incomingCallNotification();
    // incomingCallNotification()
  }, []);
  useEffect(() => {
    let interval;
    const callTerminatedListener = Sip.on("call_terminated", () => {
      InCallManager.stopRingback();
      isCallGoing = false;
      InCallManager.setSpeakerphoneOn(false);
      navigation.goBack();
    });
    const callAcceptedListener = Sip.on("call_accepted", () => {
      isCallGoing = true;
      InCallManager.stopRingback();
      interval = setInterval(() => {
        setTimerCount((lastTimerCount) => {
          return lastTimerCount + 1;
        });
      }, 1000);
    });
    return () => {
      callAcceptedListener.remove();
      callTerminatedListener.remove();
      clearInterval(interval);
    };
  }, []);

  const incomingCallNotification = async () => {

    const data = new FormData();
  
    data.append("receiver_phone", callData);
    data.append("sender_phone", username);
    const apiUrl =
    "https://billing.nextgen.ng/billing/nextgen_api/call_notification/audio_notification.php";
    postFormData(apiUrl, data)
      .then((data) => {
  
        const { success } = JSON.parse(data.msg);
        if (success) {
        } // Handle the JSON response data
      })
      .catch((error) => {
        // Handle the error
      });
    // const data = new FormData();

    // data.append("receiver_phone", callData);
    // data.append("sender_phone", username);
    // console.log("data71111-->", data);
    // hitVoiceNotificationApi(data)
    // .then((response) => {
    //   console.log(response, "response80====>");
    //   alert("hiii");
    //   if (response.data.result == "success") {
    //     checkPeermission();
    //   } else {
    //     alert("bye");
    //     InCallManager.stopRingback();
    //     Show_Toast("Something went Wrong");
    //     navigation.goBack();
    //   }
    // });
  };

  const enableSpeaker = () => {
    if (!mySpeaker) {
      InCallManager.setSpeakerphoneOn(true);
      setSpeaker(true);
    } else {
      InCallManager.setSpeakerphoneOn(false);
      setSpeaker(false);
    }
  };

  const callDisconnect = () => {
    Sip.hangupCall(Sip.ActiveCallId);
    InCallManager.stopRingback();
    navigation.goBack();
  };

  const callFeatures = (params) => {
    if (!isCallGoing) return;
    if (params === "MUTE") {
      if (!Sip?.isMuted(Sip?.ActiveCallId)) {
        Sip?.muteCall(Sip?.ActiveCallId);
        setMute(true);
      } else {
        Sip.unMuteCall(Sip?.ActiveCallId);
        setMute(false);
      }
    } else if (params === "HOLD") {
      if (!Sip?.isOnHold(Sip?.ActiveCallId)) {
        Sip.holdCall(Sip?.ActiveCallId);
        setHold(true);
      } else {
        Sip?.unholdCall(Sip?.ActiveCallId);
        setHold(false);
      }
    }
  };
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        {/* <TouchableOpacity onpress={() => callDisconnect()}>
          <Image source={ic_black_arrow} style={{ margin: 20 }} />
        </TouchableOpacity> */}

        <CustomText
          textColor={colors.black}
          text={
            callData?.name
              ? callData?.name
              : callData?.givenName
              ? callData?.givenName + " "
              : null
          }
          alignText={"center"}
          textSize={20}
          marginTop={hp(10)}
          fontWeight={"700"}
        />

        <CustomText
          textColor={colors.black}
          text={
            Sip.getRemoteNumber(Sip.ActiveCallId) &&
            Sip.getRemoteNumber(Sip.ActiveCallId).includes("_web")
              ? Sip.getRemoteNumber(Sip.ActiveCallId)?.slice(
                  0,
                  Sip.getRemoteNumber(Sip.ActiveCallId).indexOf("_web")
                )
              : Sip.getRemoteNumber(Sip.ActiveCallId)
          }
          alignText={"center"}
          textSize={26}
          // marginTop={hp(10)}
        />
        <Text style={styles.timerText}>
          {timerCount > 0 ? secondsToHMS(timerCount) : "Calling"}
        </Text>
        <Image
          style={styles.imgStyle}
          source={avatarImg ? { uri: avatarImg } : ic_avatar}
        />
        <View>
          <View style={styles.callingView}>
            <View>
              <CustomImage
                onpress={enableSpeaker}
                imgSrc={!mySpeaker ? ic_speaker : ic_speaker_fill}
                alignSelf={"center"}
              />
              <CustomText
                text={"Speaker"}
                alignText={"center"}
                textColor={colors.white}
              />
            </View>

            <View style={{ marginEnd: 15 }}>
              <CustomImage
                onpress={() => callFeatures("MUTE")}
                imgSrc={!mute ? ic_mic : ic_mic_fill}
                alignSelf={"center"}
              />
              <CustomText
                text={"Mute"}
                alignText={"center"}
                textColor={colors.white}
              />
            </View>
            <View>
              <CustomImage
                onpress={() => callFeatures("HOLD")}
                imgSrc={!hold ? ic_pause : ic_pause_fill}
                alignSelf={"center"}
              />
              <CustomText
                text={"Hold"}
                alignText={"center"}
                marginTop={5}
                textColor={colors.white}
              />
            </View>
          </View>

          {/* <View style={styles.callingView}>
              <View>
                <CustomImage imgSrc={ic_callKeyPad} alignSelf={"center"} />
                <CustomText
                  text={"Keypad"}
                  alignText={"center"}
                  textColor={colors.white}
                />
              </View>

              <View>
                <CustomImage
                  onpress={() => callFeatures("HOLD")}
                  imgSrc={!hold ? ic_pause : ic_pause_fill}
                  alignSelf={"center"}
                />
                <CustomText
                  text={"Hold"}
                  alignText={"center"}
                  marginTop={5}
                  textColor={colors.white}
                />
              </View>
            </View> */}
        </View>
        <View>
          <CustomImage
            imgSrc={ic_endcall}
            alignSelf={"center"}
            marginTop={hp(8)}
            onpress={() => {
              callDisconnect();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CallingScreen;
