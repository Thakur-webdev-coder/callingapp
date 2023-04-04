import React, { useEffect, useState } from "react";
import {
  AppState,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import AppStyle from "../../components/AppStyle";
import styles from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { request, RESULTS, PERMISSIONS } from "react-native-permissions";

import {
  ic_back,
  ic_brownArrow,
  ic_callAvatar,
  ic_camera_off,
  ic_camera_switch,
  ic_endcall,
  ic_mic_off,
  ic_mic_on,
  ic_msg,
  ic_mute_call,
  ic_speaker_small,
  ic_video_off,
  ic_video_on,
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
import {
  DEFAULT_MEETING_URL,
  MEDIA_TYPE,
} from "../../lib-jitsi-meet/constants";
import { getTrackByMediaTypeAndParticipant } from "../../lib-jitsi-meet/functions";
import { hitJoinVideoCallApi, hithangUpCallApi } from "../../constants/APi";
import { Show_Toast } from "../../utils/toast";
import InCallManager from "react-native-incall-manager";
import { updateSettings } from "../../redux/meetConfig";
import colors from "../../../assets/colors";
import { secondsToHMS } from "../../utils/commonUtils";

const CallScreen = ({ navigation, route }) => {
  const { voiceCall, callData, fromNotification } = route.params;
  console.log("rouuu---", voiceCall, callData);
  const { tracks, participants } = useSelector((state) => state);
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const [largeVideoId, setLargeVideoId] = useState(
    participants.sortedRemoteParticipants[0] || ""
  );

  console.log("getRemoteParticipants", participants);

  const [smallVideoID, setSmallVideoId] = useState(participants.local.id);
  const [timerCount, setTimerCount] = useState(0);

  const { loginDetails = {} } = useSelector((store) => store.sliceReducer);
  const { username } = loginDetails;

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
    let interval;

    if (participants.sortedRemoteParticipants[0]) {
      interval = setInterval(() => {
        setTimerCount((lastTimerCount) => {
          return lastTimerCount + 1;
        });
      }, 1000);
    }
    InCallManager.setSpeakerphoneOn(true);

    setLargeVideoId(
      participants.sortedRemoteParticipants[0] || participants.local.id
    );
    if (participants.sortedRemoteParticipants[0]) {
      setLargeVideoId(participants.sortedRemoteParticipants[0]);
      setSmallVideoId(participants.local.id);
    }

    return () => {
      clearInterval(interval);
    };
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

  const hitJoinVideoApi = async () => {
    const data = new FormData();
    data.append("receiver_phone", callData);
    data.append("sender_phone", username);
    data.append("meeting_url", DEFAULT_MEETING_URL + "newRoom");
    data.append("Type", voiceCall ? "A" : "V");

    console.log("data -->", data);
    hitJoinVideoCallApi(data).then((response) => {
      if (response.data.result == "success") {
        checkPeermission();
        // setIsLoading(false);
        // Show_Toast(response.data.msg);
      } else {
        // setIsLoading(false);
        Show_Toast("Something went Wrong");
        navigation.goBack();
      }
    });
  };

  const hitHanupCall = async () => {
    const data = new FormData();
    data.append("receiver_number", callData);

    console.log("dataasfhas -->", data);
    hithangUpCallApi(data).then((response) => {
      disconnectMeeting();
    });
  };

  useEffect(() => {
    // if (voiceCall) {
    //   dispatch(updateSettings({ startWithVideoMuted: true }));
    // } else {
    //   dispatch(updateSettings({ startWithVideoMuted: false }));
    // }
    if (fromNotification) {
      checkPeermission();
    } else {
      hitJoinVideoApi();
    }
    // checkPeermission();

    // console.log("---Remoteeeeeparticipants---", getRemoteParticipants());
    console.log("myyyy_tracksss", tracks);

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "inactive") {
        hitHanupCall();
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
  const permissions =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const disconnectMeeting = () => {
    InCallManager.setSpeakerphoneOn(false);
    dispatch(hangupMeeting());
    if (fromNotification) {
      navigation.navigate("Home");
    } else {
      navigation.goBack();
    }
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
            dispatch(startMeeting("newRoom"));

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
        {voiceCall ? (
          <View>
            <TouchableOpacity
              onPress={() => disconnectMeeting()}
              style={styles.backArrowBox}
            >
              <Image source={ic_brownArrow} />
            </TouchableOpacity>

            <CustomText
              textColor={colors.black}
              text={callData}
              alignText={"center"}
              textSize={20}
              marginTop={hp(5)}
              fontWeight={"500"}
            />
            <CustomText
              textColor={colors.black}
              text={timerCount > 0 ? secondsToHMS(timerCount) : "Calling"}
              alignText={"center"}
              textSize={12}
              marginTop={hp(1)}
              fontWeight={"400"}
            />

            <Image style={styles.avatarStyle} source={ic_callAvatar} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
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
          </View>
        )}

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
        {/* <Image source={ic_msg} style={styles.avatarStyle} />
        <Image source={ic_speaker_small} style={styles.avatarStyle} /> */}
        {!voiceCall ? (
          <TouchableOpacity
            style={styles.avatarStyle}
            onPress={() => dispatch(toggleCamera())}
          >
            <Image source={ic_camera_switch} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.avatarStyle}
          onPress={() => hitHanupCall()}
        >
          <Image source={ic_endcall} />
        </TouchableOpacity>
        {!voiceCall ? (
          <TouchableOpacity
            style={styles.avatarStyle}
            onPress={() => videoEnable()}
          >
            <Image source={enableVideo ? ic_video_off : ic_video_on} />
          </TouchableOpacity>
        ) : null}
        {!voiceCall ? (
          <TouchableOpacity
            style={styles.avatarStyle}
            onPress={() => audioEnable()}
          >
            <Image source={enableAudio ? ic_mic_off : ic_mic_on} />
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
export default CallScreen;
