import React, { useEffect, useState } from "react";
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
import { request, RESULTS, PERMISSIONS } from "react-native-permissions";

import {
  ic_add,
  ic_back,
  ic_brownArrow,
  ic_callAvatar,
  ic_camera_off,
  ic_camera_switch,
  ic_contact_avatar,
  ic_endcall,
  ic_msg,
  ic_mute_call,
  ic_speaker_small,
} from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
import {
  hangupMeeting,
  setAudioMuted,
  setVideoMuted,
  startMeeting,
  toggleCamera,
} from "../../lib-jitsi-meet/actions";
import { useDispatch, useSelector } from "react-redux";
import { RTCView } from "react-native-webrtc";
import { Show_Toast } from "../../utils/toast";
import { DEFAULT_MEETING_URL } from "../../lib-jitsi-meet/constants";
import {
  getLocalVideoTrack,
  getRemoteParticipants,
} from "../../lib-jitsi-meet/functions";
const CallScreen = ({ navigation, route }) => {
  const { voiceCall } = route.params;
  console.log("rouuu---", voiceCall);
  // const dispatch = useDispatch();
  // const { tracks } = useSelector((store) => store);
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);

  const { tracks, participants } = useSelector((state) => state);
  const dispatch = useDispatch();
  var localVideoTrack = getLocalVideoTrack(tracks);

  console.log(
    "---localVideoTrack---",
    localVideoTrack?.jitsiTrack?.stream.toURL()
  );

  const videoEnable = () => {
    if (enableVideo) {
      setEnableVideo(false);
    } else {
      setEnableVideo(true);
    }
    console.log("herreee---", "hereeee");

    dispatch(setVideoMuted(enableVideo));
  };

  const audioEnable = () => {
    if (enableAudio) {
      setEnableAudio(false);
    } else {
      setEnableAudio(true);
    }
    console.log("herreee---", "hereeee");

    dispatch(setAudioMuted(enableAudio));
  };

  useEffect(() => {
    checkPeermission();
    // console.log("---Remoteeeeeparticipants---", getRemoteParticipants());
    console.log("myyyy_tracksss", tracks);
  }, []);
  const permissions =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const disconnectMeeting = () => {
    dispatch(hangupMeeting());
    navigation.goBack();
  };

  const checkPeermission = () => {
    request(permissions)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable",
              RESULTS.DENIED
            );
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("granted------");
            dispatch(startMeeting("919588220190"));

            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            break;
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  return (
    <SafeAreaView style={voiceCall ? AppStyle.wrapper : styles.wrapper}>
      <View style={{ flex: 4 }}>
        <TouchableOpacity
          onPress={() => disconnectMeeting()}
          style={styles.backArrowBox}
        >
          <Image source={voiceCall ? ic_brownArrow : ic_back} />
        </TouchableOpacity>

        <CustomText
          textColor={voiceCall ? colors.black : colors.white}
          text={"918800810156"}
          alignText={"center"}
          textSize={20}
          marginTop={hp(5)}
          fontWeight={"500"}
        />
        <CustomText
          textColor={voiceCall ? colors.black : colors.white}
          text={"Calling..."}
          alignText={"center"}
          textSize={12}
          marginTop={hp(1)}
          fontWeight={"400"}
        />

        <RTCView
          style={{ flex: 1 }}
          objectFit="cover"
          mirror={localVideoTrack?.mirror}
          streamURL={localVideoTrack?.jitsiTrack?.stream.toURL() || ""}
        />

        {/* <Image
          style={voiceCall ? styles.avatarStyle : styles.videoStyle}
          source={
            voiceCall
              ? ic_callAvatar
              : {
                  uri: "https://png.pngtree.com/background/20220726/original/pngtree-smiling-woman-having-conference-video-call-picture-image_1810453.jpg",
                }
          }
        /> */}
      </View>

      <View style={styles.bottomStyle}>
        <Image source={ic_msg} style={styles.avatarStyle} />
        <Image source={ic_speaker_small} style={styles.avatarStyle} />
        {/* {!voiceCall ? ( */}
        <TouchableOpacity
          style={styles.avatarStyle}
          onPress={() => dispatch(toggleCamera())}
        >
          <Image source={ic_camera_switch} />
        </TouchableOpacity>
        {/* ) : null} */}
        <TouchableOpacity
          style={styles.avatarStyle}
          onPress={() => disconnectMeeting()}
        >
          <Image source={ic_endcall} />
        </TouchableOpacity>
        {/* {!voiceCall ? ( */}
        <TouchableOpacity
          style={styles.avatarStyle}
          onPress={() => videoEnable()}
        >
          <Image source={ic_camera_off} />
        </TouchableOpacity>
        {/* ) : null} */}
        <TouchableOpacity
          style={styles.avatarStyle}
          onPress={() => audioEnable()}
        >
          <Image source={ic_mute_call} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default CallScreen;
