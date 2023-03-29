import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import AppStyle from "../../components/AppStyle";
import styles from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";
import { request, RESULTS, PERMISSIONS } from "react-native-permissions";

import {
  ic_back,
  ic_brownArrow,
  ic_camera_off,
  ic_camera_switch,
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
import { MEDIA_TYPE } from "../../lib-jitsi-meet/constants";
import { getTrackByMediaTypeAndParticipant } from "../../lib-jitsi-meet/functions";

const CallScreen = ({ navigation, route }) => {
  const { voiceCall } = route.params;
  console.log("rouuu---", voiceCall);
  // const dispatch = useDispatch();
  // const { tracks } = useSelector((store) => store);
  const { tracks, participants } = useSelector((state) => state);
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const [largeVideoId, setLargeVideoId] = useState(
    participants.sortedRemoteParticipants[0] || ""
  );
  const [smallVideoID, setSmallVideoId] = useState(participants.local.id);

  const dispatch = useDispatch();
  var largeVideoTrack = getTrackByMediaTypeAndParticipant(
    tracks,
    MEDIA_TYPE.VIDEO,
    largeVideoId
  );

  var smallVideoTrack = getTrackByMediaTypeAndParticipant(
    tracks,
    MEDIA_TYPE.VIDEO,
    smallVideoID
  );
  useEffect(() => {
    setLargeVideoId(
      participants.sortedRemoteParticipants[0] || participants.local.id
    );
    if (participants.sortedRemoteParticipants[0]) {
      setLargeVideoId(participants.sortedRemoteParticipants[0]);
      setSmallVideoId(participants.local.id);
    }
  }, [participants.local.id, participants.sortedRemoteParticipants[0]]);

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

  const switchStreamUrl = () => {
    setLargeVideoId(smallVideoID);
    setSmallVideoId(largeVideoId);
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
            dispatch(startMeeting("testRoom"));

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
        {/* <TouchableOpacity
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
        /> */}

        <RTCView
          style={{ flex: 1 }}
          objectFit="cover"
          mirror={largeVideoTrack?.mirror}
          streamURL={largeVideoTrack?.jitsiTrack?.stream.toURL()}
        />

        {participants.sortedRemoteParticipants.length > 0 ? (
          <TouchableOpacity
            style={{
              height: hp(25),
              width: wp(40),
              backgroundColor: "green",
              position: "absolute",
              right: 10,
              bottom: hp(5),
            }}
            onPress={() => switchStreamUrl()}
          >
            <RTCView
              style={{ height: hp(25), width: wp(40) }}
              objectFit="cover"
              streamURL={smallVideoTrack?.jitsiTrack?.stream.toURL()}
            />
          </TouchableOpacity>
        ) : null}

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
