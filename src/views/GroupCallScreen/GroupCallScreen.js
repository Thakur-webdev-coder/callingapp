// import React, { useEffect, useState } from "react";
// import {
//   AppState,
//   BackHandler,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import AppStyle from "../../components/AppStyle";
// import styles from "./styles";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { request, RESULTS, PERMISSIONS } from "react-native-permissions";

// import {
//   ic_back,
//   ic_brownArrow,
//   ic_callAvatar,
//   ic_camera_off,
//   ic_camera_switch,
//   ic_endcall,
//   ic_mic_off,
//   ic_mic_on,
//   ic_msg,
//   ic_mute_call,
//   ic_speaker,
//   ic_speaker_fill,
//   ic_speaker_small,
//   ic_video_off,
//   ic_video_on,
// } from "../../routes/imageRoutes";
// import CustomText from "../../components/CustomText";
// import {
//   hangupMeeting,
//   setAudioMuted,
//   setVideoMuted,
//   startMeeting,
//   toggleCamera,
// } from "../../lib-jitsi-meet/actions";
// import { useDispatch, useSelector } from "react-redux";
// import { RTCView } from "react-native-webrtc";
// import {
//   DEFAULT_MEETING_URL,
//   MEDIA_TYPE,
// } from "../../lib-jitsi-meet/constants";
// import {
//   getAvatarColor,
//   getInitials,
//   getParticipantById,
//   getTrackByMediaTypeAndParticipant,
// } from "../../lib-jitsi-meet/functions";
// import {
//   hitJoinVideoCallApi,
//   hithangUpCallApi,
//   hitJoinGroupVideoCallApi,
//   hitgroupVideoCallNotify,
// } from "../../constants/APi";
// import { Show_Toast } from "../../utils/toast";
// import InCallManager from "react-native-incall-manager";
// import colors from "../../../assets/colors";
// import { generateRandomString, secondsToHMS } from "../../utils/commonUtils";
// import Loading from "react-native-whc-loading";

// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// import { Dimensions } from "react-native";
// import Avatar from "../../utils/avatar";
// const windowHeight = Dimensions.get("window").height;

// let roomId = null;

// const GroupCallScreen = ({ navigation, route }) => {
//   const { voiceCall, callData, fromNotification, meetimgUrl } = route.params;
//   console.log("rouuu---", route.params);
//   const { tracks, participants } = useSelector((state) => state);
//   const [enableVideo, setEnableVideo] = useState(false);
//   const [enableAudio, setEnableAudio] = useState(false);
//   const [largeVideoId, setLargeVideoId] = useState(
//     participants.sortedRemoteParticipants || ""
//   );

//   const { remote, local } = useSelector((store) => store.participants);
//   const participant = useSelector((state) =>
//     getParticipantById(state, "local")
//   );

//   const [isLoading, setIsLoading] = useState(false);

//   console.log(
//     "getRemoteParticipants",
//     participants,
//     route.params,
//     "=========71 group callss"
//   );

//   const [smallVideoID, setSmallVideoId] = useState(participants.local.id);
//   const [timerCount, setTimerCount] = useState(0);
//   const [speaker, setSpeaker] = useState(false);

//   const { loginDetails = {} } = useSelector((store) => store.sliceReducer);
//   const { username } = loginDetails;

//   console.log("participantsss", participants);

//   const dispatch = useDispatch();

//   var smallVideoTrack = getTrackByMediaTypeAndParticipant(
//     tracks,
//     MEDIA_TYPE.VIDEO,
//     smallVideoID
//   );

//   let AllIds = [smallVideoID, ...largeVideoId];
//   useEffect(() => {
//     let interval;

//     if (fromNotification) {
//       InCallManager.stopRingback();
//     } else {
//       if (participants.sortedRemoteParticipants[0]) {
//         InCallManager.stopRingback();
//       } else {
//         InCallManager.startRingback();
//       }
//     }

//     if (voiceCall && participants.sortedRemoteParticipants[0]) {
//       dispatch(setVideoMuted(true));

//       interval = setInterval(() => {
//         setTimerCount((lastTimerCount) => {
//           return lastTimerCount + 1;
//         });
//       }, 1000);
//     } else {
//       InCallManager.setSpeakerphoneOn(true);
//     }

//     setLargeVideoId(
//       participants.sortedRemoteParticipants || participants.local.id
//     );
//     if (participants.sortedRemoteParticipants) {
//       setLargeVideoId(participants.sortedRemoteParticipants);
//       setSmallVideoId(participants.local.id);
//     }

//     if (participants.sortedRemoteParticipants && !voiceCall) {
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 6000);
//     } else {
//       setIsLoading(true);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [participants.local.id, participants.sortedRemoteParticipants]);

//   const videoEnable = () => {
//     if (!enableVideo) {
//       dispatch(setVideoMuted(true));
//       setEnableVideo(true);
//     } else {
//       dispatch(setVideoMuted(false));
//       setEnableVideo(false);
//     }

//     console.log("herreee---", "hereeee");
//   };

//   const audioEnable = () => {
//     if (!enableAudio) {
//       dispatch(setAudioMuted(true));
//       setEnableAudio(true);
//     } else {
//       dispatch(setAudioMuted(false));
//       setEnableAudio(false);
//     }

//     console.log("herreee---", "hereeee");
//   };

//   const switchStreamUrl = () => {
//     setLargeVideoId(smallVideoID);
//     setSmallVideoId(largeVideoId);
//   };

//   useEffect(() => {
//     console.log("in2nduseeffect----->>>");
//     // roomId = generateRandomString();
//     roomId = "Test";

//     console.log("roomId==========>", roomId);
//     if (fromNotification) {
//       console.log("inif--------->>>>");
//       dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));
//       // checkPeermission();
//     } else {
//       console.log("inelse--------->>>>");
//       hitJoinVideoApi();
//     }

//     console.log("myyyy_tracksss", tracks);

//     const handleAppStateChange = (nextAppState) => {
//       if (nextAppState === "inactive") {
//         console.log("hitHanupCall----->>111");
//         hitHanupCall();
//       }
//     };

//     AppState.addEventListener("change", handleAppStateChange);

//     return () => {
//       AppState.removeEventListener("change", handleAppStateChange);
//       // backHandler.remove();
//     };
//   }, []);

//   const hitJoinVideoApi = async () => {
//     const data = new FormData();

//     console.log(callData, "=======182=====>>>8222222222");

//     const filteredList =
//       callData.length && callData?.filter((item) => item !== username);

//     const participants = filteredList?.join(", ");

//     data.append("receiver_phone", participants);
//     data.append("sender_phone", username);
//     data.append("meeting_url", roomId);
//     data.append("Type", voiceCall ? "A" : "V");
//     data.append("call_type", "group");

//     console.log("data -->", data);
//     hitgroupVideoCallNotify(data).then((response) => {
//       if (response.data.result == "success") {
//         // checkPeermission();
//         dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));
//       } else {
//         InCallManager.stopRingback();
//         Show_Toast("Something went Wrong");
//         navigation.goBack();
//       }
//     });
//   };

//   const hitHanupCall = async () => {
//     const data = new FormData();
//     data.append("receiver_number", callData);

//     console.log("dataasfhas -->", data);
//     hithangUpCallApi(data).then((response) => {
//       disconnectMeeting();
//     });
//   };

//   const enableSpeaker = () => {
//     if (!speaker) {
//       InCallManager.setSpeakerphoneOn(true);
//       setSpeaker(true);
//     } else {
//       InCallManager.setSpeakerphoneOn(false);
//       setSpeaker(false);
//     }
//   };

//   const permissions =
//     Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

//   const disconnectMeeting = () => {
//     InCallManager.stopRingback();

//     InCallManager.setSpeakerphoneOn(false);
//     dispatch(hangupMeeting());
//     if (fromNotification) {
//       navigation.navigate("Home");
//     } else {
//       navigation.goBack();
//     }
//   };

//   const checkPeermission = () => {
//     request(permissions)
//       .then((result) => {
//         switch (result) {
//           case RESULTS.UNAVAILABLE:
//             console.log(
//               "This feature is not available (on this device / in this context)"
//             );
//             break;
//           case RESULTS.DENIED:
//             console.log(
//               "The permission has not been requested / is denied but requestable",
//               RESULTS.DENIED
//             );
//             break;
//           case RESULTS.LIMITED:
//             console.log("The permission is limited: some actions are possible");
//             break;
//           case RESULTS.GRANTED:
//             console.log("granted------");
//             dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));

//             break;
//           case RESULTS.BLOCKED:
//             console.log("The permission is denied and not requestable anymore");
//             break;
//         }
//       })
//       .catch((error) => {
//         console.log("errr----", error);
//       });
//   };

//   const parcipanLength = participants?.sortedRemoteParticipants?.length;

//   console.log("lengthhthththht", parcipanLength);

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60)
//       .toString()
//       .padStart(2, "0");
//     const remainingSeconds = (time % 60).toString().padStart(2, "0");
//     return `${minutes}:${remainingSeconds}`;
//   };

//   const renderVideos = ({ item, index }) => {
//     let largeVideoTrack = getTrackByMediaTypeAndParticipant(
//       tracks,
//       MEDIA_TYPE.VIDEO,
//       item
//     );

//     console.log(largeVideoTrack?.muted, "item.index====>");

//     var activeParticipant = remote[item] || local;
//     // console.log(p, "p=========>")
//     const initials = getInitials(activeParticipant?.name);

//     return (
//       <TouchableOpacity
//         activeOpacity={1}
//         //   onPress={() => {
//         //     setShowButton(!showButton);
//         //   }
//         // }
//         style={{
//           height:
//             parcipanLength <= 1
//               ? Platform.OS === "android"
//                 ? hp(95)
//                 : hp(92)
//               : Platform.OS === "android"
//               ? hp(46)
//               : hp(42),
//           width:
//             index === 2 && parcipanLength === 2
//               ? wp("99.5%")
//               : parcipanLength <= 1
//               ? wp(99.5)
//               : wp("50%"),
//           backgroundColor: "white",
//         }}
//       >
//         {largeVideoTrack?.muted == false ? (
//           <View>
//             <RTCView
//               style={{
//                 height:
//                   parcipanLength < 1
//                     ? Platform.OS === "android"
//                       ? hp(95)
//                       : hp(92)
//                     : Platform.OS === "android"
//                     ? hp(46)
//                     : hp(42),
//                 width:
//                   index === 2 && parcipanLength === 2
//                     ? wp("99.5%")
//                     : parcipanLength <= 1
//                     ? wp(99.5)
//                     : wp("50%"),
//                 backgroundColor: "black",
//               }}
//               objectFit="cover"
//               mirror={largeVideoTrack?.mirror}
//               streamURL={largeVideoTrack?.jitsiTrack?.stream.toURL()}
//             />
//             {/* <Text
//             style={{
//               position: "absolute",
//               zIndex: 10,
//               bottom: 10,
//               left: 30,
//               color: "blue",
//               fontSize: 18,
//               fontWeight: "bold",
//             }}
//           >
//             {activeParticipant?.name?.split("_")[0]}
//           </Text> */}
//           </View>
//         ) : (
//           <View>
//             <Avatar
//               size={150}
//               url={participant?.avatarURL}
//               style={{
//                 height:
//                   parcipanLength <= 1
//                     ? Platform.OS === "android"
//                       ? hp(95)
//                       : hp(92)
//                     : Platform.OS === "android"
//                     ? hp(46)
//                     : hp(42),
//                 width:
//                   index === 2 && parcipanLength === 2
//                     ? wp("99.5%")
//                     : parcipanLength <= 1
//                     ? wp(99.5)
//                     : wp("50%"),
//                 backgroundColor: getAvatarColor(initials),
//               }}
//               color={getAvatarColor(initials)}
//               initials={initials}
//             />
//             {/* <Text
//               style={{
//                 position: "absolute",
//                 zIndex: 10,
//                 bottom: 10,
//                 left: 30,
//                 color: "blue",
//                 fontSize: 18,
//                 fontWeight: "bold",
//               }}
//             >
//               {activeParticipant.name.split("_")[0]}
//             </Text> */}
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.containerStyle}>
//       {/* <StatusBar backgroundColor={'#000000'}/> */}
//       {smallVideoTrack === "" || smallVideoTrack == undefined ? (
//         <View>
//           <Text>Connectinggg.......</Text>
//         </View>
//       ) : (
//         <View style={{ flex: 1, backgroundColor: "#000000" }}>
//           {
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <FlatList
//                 numColumns={2}
//                 showsVerticalScrollIndicator={false}
//                 scrollEnabled={parcipanLength <= 1 ? false : true}
//                 data={AllIds}
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={renderVideos}
//               />
//               <View
//                 style={{
//                   position: "absolute",
//                   height: 40,
//                   width: "20%",
//                   backgroundColor: "transparent",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   left: 10,
//                   top: 20,
//                   borderRadius: 5,
//                 }}
//               >
//                 <Text
//                   style={{ color: "red", fontSize: 18, fontWeight: "bold" }}
//                 >
//                   {formatTime(timerCount)}
//                 </Text>
//               </View>
//             </View>
//           }
//         </View>
//       )}
//       {/* {<GallaryManager
//         //adddedddddddddddd
//       />} */}

//       <View style={styles.bottomStyle}>
//           {/* <Image source={ic_msg} style={styles.avatarStyle} />
//         <Image source={ic_speaker_small} style={styles.avatarStyle} /> */}
//           {!voiceCall ? (
//             <TouchableOpacity
//               style={styles.avatarStyle}
//               onPress={() => dispatch(toggleCamera())}
//             >
//               <Image source={ic_camera_switch} />
//             </TouchableOpacity>
//           ) : null}

//           {voiceCall ? (
//             <TouchableOpacity
//               style={styles.avatarStyle}
//               onPress={() => enableSpeaker()}
//             >
//               <Image source={!speaker ? ic_speaker : ic_speaker_fill} />
//             </TouchableOpacity>
//           ) : null}
//           <TouchableOpacity
//             style={styles.avatarStyle}
//             onPress={() => hitHanupCall()}
//           >
//             <Image source={ic_endcall} />
//           </TouchableOpacity>
//           {!voiceCall ? (
//             <TouchableOpacity
//               style={styles.avatarStyle}
//               onPress={() => videoEnable()}
//             >
//               <Image source={enableVideo ? ic_video_off : ic_video_on} />
//             </TouchableOpacity>
//           ) : null}

//           <TouchableOpacity
//             style={styles.avatarStyle}
//             onPress={() => audioEnable()}
//           >
//             <Image source={enableAudio ? ic_mic_off : ic_mic_on} />
//           </TouchableOpacity>
//         </View>

//       <StatusBar />
//     </SafeAreaView>
//   );
// };

// export default GroupCallScreen;
import React, { useEffect, useState } from "react";
import {
  AppState,
  BackHandler,
  Image,
  SafeAreaView,
  Text,
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
  ic_speaker,
  ic_speaker_fill,
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
import {
  hitJoinVideoCallApi,
  hitgroupVideoCallNotify,
  hithangUpCallApi,
} from "../../constants/APi";
import { Show_Toast } from "../../utils/toast";
import InCallManager from "react-native-incall-manager";
import colors from "../../../assets/colors";
import { generateRandomString, secondsToHMS } from "../../utils/commonUtils";
import Loading from "react-native-whc-loading";

let roomId = null;
const GroupCallScreen = ({ navigation, route }) => {
  const { voiceCall, callData, fromNotification, meetimgUrl } = route.params;
  console.log("rouuu---", route.params);
  const { tracks, participants } = useSelector((state) => state);
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const [largeVideoId, setLargeVideoId] = useState(
    participants.sortedRemoteParticipants[0] || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  console.log(
    "getRemoteParticipants",
    participants,
    route.params,
    "=========71 group callss"
  );

  const [smallVideoID, setSmallVideoId] = useState(participants.local.id);
  const [timerCount, setTimerCount] = useState(0);
  const [speaker, setSpeaker] = useState(false);

  const { loginDetails = {} } = useSelector((store) => store.sliceReducer);
  const { username } = loginDetails;

  console.log("participantsss", participants);

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

    if (fromNotification) {
      InCallManager.stopRingback();
    } else {
      if (participants.sortedRemoteParticipants[0]) {
        InCallManager.stopRingback();
      } else {
        InCallManager.startRingback();
      }
    }

    if (voiceCall && participants.sortedRemoteParticipants[0]) {
      dispatch(setVideoMuted(true));

      interval = setInterval(() => {
        console.log(
          "119 intervel on the file name  Group   77567567984569078569080958656856868%>>>>>>>>>>>>>>>>>>>"
        );
        InCallManager.stopRingback();
        setTimerCount((lastTimerCount) => {
          return lastTimerCount + 1;
        });
      }, 1000);
    } else {
      InCallManager.setSpeakerphoneOn(true);
    }

    setLargeVideoId(
      participants.sortedRemoteParticipants[0] || participants.local.id
    );
    if (participants.sortedRemoteParticipants[0]) {
      setLargeVideoId(participants.sortedRemoteParticipants[0]);
      setSmallVideoId(participants.local.id);
    }

    if (participants.sortedRemoteParticipants[0] && !voiceCall) {
      setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    } else {
      setIsLoading(true);
    }

    return () => {
      clearInterval(interval);
    };
  }, [participants.local.id, participants.sortedRemoteParticipants[0]]);

  const videoEnable = () => {
    if (!enableVideo) {
      dispatch(setVideoMuted(true));
      setEnableVideo(true);
    } else {
      dispatch(setVideoMuted(false));
      setEnableVideo(false);
    }

    console.log("herreee---", "hereeee");
  };

  const audioEnable = () => {
    if (!enableAudio) {
      dispatch(setAudioMuted(true));
      setEnableAudio(true);
    } else {
      dispatch(setAudioMuted(false));
      setEnableAudio(false);
    }

    console.log("herreee---", "hereeee");
  };

  const switchStreamUrl = () => {
    setLargeVideoId(smallVideoID);
    setSmallVideoId(largeVideoId);
  };

  const hitJoinVideoApi = async () => {
    const data = new FormData();
    // console.log(callData, "=======182=====>>>8222222222");
    const filteredList =
      callData.length && callData?.filter((item) => item !== username);
    const participants = filteredList?.join(", ");
    console.log(participants, "========184====>>>>>>>>>>>>", username);
    data.append("receiver_phone", participants);
    data.append("sender_phone", username);
    data.append("meeting_url", roomId);
    data.append("Type", voiceCall ? "A" : "V");
    data.append("call_type", "group");
    console.log("data -->", data);
    hitgroupVideoCallNotify(data).then((response) => {
      console.log("response gruop call===>", response);
      if (response.data.result == "success") {
        checkPeermission();
      } else {
        InCallManager.stopRingback();
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
      console.log(response, "=======>210");
      disconnectMeeting();
    });
  };

  const enableSpeaker = () => {
    if (!speaker) {
      InCallManager.setSpeakerphoneOn(true);
      setSpeaker(true);
    } else {
      InCallManager.setSpeakerphoneOn(false);
      setSpeaker(false);
    }
  };

  useEffect(() => {
    roomId = generateRandomString();

    if (fromNotification) {
      checkPeermission();
    } else {
      hitJoinVideoApi();
    }

    console.log("myyyy_tracksss", tracks);

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "inactive") {
        hitHanupCall();
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    const backAction = () => {
      console.log("Back button is pressed");
      hitHanupCall();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
      backHandler.remove();
    };
  }, []);

  const permissions =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const disconnectMeeting = () => {
    InCallManager.stopRingback();
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
            dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));

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
        {
          voiceCall ? (
            <View>
              <TouchableOpacity
                onPress={() => hitHanupCall()}
                style={styles.backArrowBox}
              >
                <Image source={ic_brownArrow} />
              </TouchableOpacity>

              <CustomText
                textColor={colors.black}
                text={"Group Call"}
                alignText={"center"}
                textSize={20}
                marginTop={hp(5)}
                fontWeight={"500"}
              />
              <CustomText
                textColor={colors.black}
                text={timerCount > 0 ? secondsToHMS(timerCount) : "Connecting"}
                alignText={"center"}
                textSize={12}
                marginTop={hp(1)}
                fontWeight={"400"}
              />

              <Image style={styles.avatarStyle} source={ic_callAvatar} />
            </View>
          ) : null
          // <View style={{ flex: 1 }}>
          //   <RTCView
          //     style={{ flex: 1 }}
          //     objectFit="cover"
          //     mirror={largeVideoTrack?.mirror}
          //     streamURL={largeVideoTrack?.jitsiTrack?.stream.toURL()}
          //   />

          //   {isLoading ? (
          //     <Text
          //       style={{
          //         color: colors.white,
          //         flex: 1,
          //         alignSelf: "center",
          //         justifyContent: "center",
          //         fontSize: 20,
          //         fontWeight: "bold",
          //         position: "absolute",
          //         top: hp(40),
          //         bottom: hp(40),
          //       }}
          //     >
          //       Connecting
          //     </Text>
          //   ) : null}

          //   {participants.sortedRemoteParticipants.length > 0 ? (
          //     <TouchableOpacity
          //       style={{
          //         height: hp(25),
          //         width: wp(40),
          //         backgroundColor: "green",
          //         position: "absolute",
          //         right: 10,
          //         bottom: hp(5),
          //       }}
          //       onPress={() => switchStreamUrl()}
          //     >
          //       <RTCView
          //         style={{ height: hp(25), width: wp(40) }}
          //         objectFit="cover"
          //         streamURL={smallVideoTrack?.jitsiTrack?.stream.toURL()}
          //       />
          //     </TouchableOpacity>
          //   ) : null}
          // </View>
        }
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

        {voiceCall ? (
          <TouchableOpacity
            style={styles.avatarStyle}
            onPress={() => enableSpeaker()}
          >
            <Image source={!speaker ? ic_speaker : ic_speaker_fill} />
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

        <TouchableOpacity
          style={styles.avatarStyle}
          onPress={() => audioEnable()}
        >
          <Image source={enableAudio ? ic_mic_off : ic_mic_on} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default GroupCallScreen;
