import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppStyle from "../../components/AppStyle";
import CustomImage from "../../components/CustomImage";
import {
  ic_bluetooth,
  ic_callingPerson,
  ic_callKeyPad,
  ic_endcall,
  ic_mute,
  ic_speaker,
  ic_CallingBg,
  ic_speaker_fill,
  ic_pause_fill,
  ic_pause,
  ic_mic,
  ic_mic_fill,
} from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import styles from "./styles";
import colors from "../../../assets/colors";

import Sip from "@khateeb00/react-jssip";
import { secondsToHMS } from "../../utils/commonUtils";

import InCallManager from "react-native-incall-manager";

let isCallGoing = null;

const CallingScreen = ({ navigation, route }) => {
  // const [state, setState] = useState({
  //   timerCount: 0,
  // });
  const [timerCount, setTimerCount] = useState(0);
  const [mute, setMute] = useState(false);
  const [hold, setHold] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const callData = route.params;

  console.log("callData---->", callData);

  useEffect(() => {
    console.log("ashfioasf", Sip);
    let interval;
    const callTerminatedListener = Sip.on("call_terminated", () => {
      isCallGoing = false;
      InCallManager.setSpeakerphoneOn(false);
      navigation.goBack();
    });
    const callAcceptedListener = Sip.on("call_accepted", () => {
      isCallGoing = true;

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

  const callDisconnect = () => {
    Sip.hangupCall(Sip.ActiveCallId);
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
    } else {
      InCallManager.setSpeakerphoneOn(!speaker);
      setSpeaker(!speaker);
    }
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        <ImageBackground
          style={{ flex: 1, flexDirection: "column", paddingHorizontal: 20 }}
          source={ic_CallingBg}
        >
          <CustomImage
            imgSrc={ic_callingPerson}
            alignSelf={"center"}
            marginTop={hp(15)}
          />

          <CustomText
            textColor={colors.white}
            text={Sip.getRemoteNumber(Sip.ActiveCallId)}
            alignText={"center"}
            textSize={18}
            marginTop={5}
          />

          <Text style={styles.timerText}>
            {timerCount > 0 ? secondsToHMS(timerCount) : "Calling"}
          </Text>

          <View>
            <View style={styles.callingView}>
              <View>
                <CustomImage
                  onpress={callFeatures}
                  imgSrc={!speaker ? ic_speaker : ic_speaker_fill}
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
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default CallingScreen;
