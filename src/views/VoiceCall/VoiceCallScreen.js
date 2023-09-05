import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppStyle from '../../components/AppStyle';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { request, RESULTS, PERMISSIONS } from 'react-native-permissions';

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
} from '../../routes/imageRoutes';
import CustomText from '../../components/CustomText';
import {
  hangupMeeting,
  setAudioMuted,
  setVideoMuted,
  startMeeting,
  toggleCamera,
} from '../../lib-jitsi-meet/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RTCView } from 'react-native-webrtc';
import {
  DEFAULT_MEETING_URL,
  MEDIA_TYPE,
} from '../../lib-jitsi-meet/constants';
import { getTrackByMediaTypeAndParticipant } from '../../lib-jitsi-meet/functions';
import { hitJoinVideoCallApi, hithangUpCallApi } from '../../constants/APi';
import { Show_Toast } from '../../utils/toast';
import InCallManager from 'react-native-incall-manager';
import colors from '../../../assets/colors';
import { generateRandomString, secondsToHMS } from '../../utils/commonUtils';
import Loading from 'react-native-whc-loading';
import KeepAwake from 'react-native-keep-awake';

let roomId = null;

const CallScreen = ({ navigation, route }) => {
  const { voiceCall, callData, fromNotification, meetimgUrl } = route.params;
  const { tracks, participants } = useSelector((state) => state);
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const [largeVideoId, setLargeVideoId] = useState(
    participants.sortedRemoteParticipants[0] || ''
  );
  const [isLoading, setIsLoading] = useState(false);

  console.log('getRemoteParticipants', participants);

  const [smallVideoID, setSmallVideoId] = useState(participants.local.id);
  const [timerCount, setTimerCount] = useState(0);
  const [speaker, setSpeaker] = useState(false);

  const { loginDetails = {} } = useSelector((store) => store.sliceReducer);
  const { username } = loginDetails;

  console.log('participantsss', participants);

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
    // Activate screen awake when screen is focused
    KeepAwake.activate();
    
    return () => {
      // Deactivate screen awake when screen loses focus
      KeepAwake.deactivate();
    };
  }, []);
  
  useEffect(() => {
    let interval;

    if (fromNotification) {
      console.log('fromNotification--if--->>>', fromNotification);
      InCallManager.stopRingback();
    } else {
      console.log('fromNotification--else--->>>');

      if (participants.sortedRemoteParticipants[0]) {
        console.log('fromNotification--ifinelse--->>>');

        InCallManager.stopRingback();
      } else {
        console.log('fromNotification--elseinelse--->>>');

        InCallManager.startRingback();
      }
    }

    if (voiceCall && participants.sortedRemoteParticipants[0]) {
      console.log('voiceCall && participants--if--->>>', voiceCall, participants.sortedRemoteParticipants[0]);

      dispatch(setVideoMuted(true));

      interval = setInterval(() => {
        setTimerCount((lastTimerCount) => {
          return lastTimerCount + 1;
        });
      }, 1000);
    } else {
      console.log('fromNotification--inelse--->>>');
      InCallManager.setSpeakerphoneOn(true);
    }

    setLargeVideoId(
      participants.sortedRemoteParticipants[0] || participants.local.id
    );

    if (participants.sortedRemoteParticipants[0]) {
      console.log('participants.sortedRemoteParticipants[0]--inif--->>>');
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

    console.log('herreee---', 'hereeee');
  };

  const audioEnable = () => {
    if (!enableAudio) {
      dispatch(setAudioMuted(true));
      setEnableAudio(true);
    } else {
      dispatch(setAudioMuted(false));
      setEnableAudio(false);
    }

    console.log('herreee---', 'hereeee');
  };

  const switchStreamUrl = () => {
    setLargeVideoId(smallVideoID);
    setSmallVideoId(largeVideoId);
  };

  const hitJoinVideoApi = () => {
   
    const data = new FormData();
    data.append('receiver_phone', callData);
    data.append('sender_phone', username);
    data.append('meeting_url', roomId);
    data.append('Type', voiceCall ? 'A' : 'V');

    console.log('data -->', data);
    hitJoinVideoCallApi(data).then((response) => {
      if (response.data.result == 'success') {
        // checkPeermission();
        dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));
      } else {
        InCallManager.stopRingback();
        Show_Toast('Something went Wrong');
        navigation.goBack();
      }
    });
  };

  const hitHanupCall = async () => {
    const data = new FormData();
    data.append('receiver_number', callData);

    console.log('dataasfhas -->', data);
    hithangUpCallApi(data).then((response) => {
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
    console.log('in2nduseeffect----->>>');
    roomId = generateRandomString();
    console.log('roomId==========>', roomId);
    if (fromNotification) {
      console.log('inif--------->>>>');
      dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));
      // checkPeermission();
    } else {
      console.log('inelse--------->>>>');
      hitJoinVideoApi();
    }

    console.log('myyyy_tracksss', tracks);

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'inactive') {
        console.log('hitHanupCall----->>111');
        hitHanupCall();
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    // const backAction = () => {
    //   console.log('Back button is pressed');
    //   Alert.alert(
    //     '',
    //     'Do you want to continue call ?',
    //     [
    //       { text: 'Hangup', onPress: () => hitHanupCall() },
    //       {
    //         text: 'Continue',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel',
    //       },
    //     ],
    //     { cancelable: true }
    //   );
    //   // hitHanupCall();
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction
    // );

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      // backHandler.remove();
    };
  }, []);

  // const permissions =
  //   Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const disconnectMeeting = () => {
    InCallManager.stopRingback();

    InCallManager.setSpeakerphoneOn(false);
    dispatch(hangupMeeting());
    if (fromNotification) {
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  // const checkPeermission = () => {
  //   console.log('checkPeermission------->>>');
  //   request(permissions)
  //     .then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //           console.log(
  //             'This feature is not available (on this device / in this context)================>>>>>>>'
  //           );
  //           break;
  //         case RESULTS.DENIED:
  //           console.log(
  //             'The permission has not been requested / is denied but requestable',
  //             RESULTS.DENIED
  //           );
  //           break;
  //         case RESULTS.LIMITED:
  //           console.log('The permission is limited: some actions are possible');
  //           break;
  //         case RESULTS.GRANTED:
  //           console.log('granted------');
  //           dispatch(startMeeting(fromNotification ? meetimgUrl : roomId));

  //           break;
  //         case RESULTS.BLOCKED:
  //           console.log('The permission is denied and not requestable anymore');
  //           break;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('errr----', error);
  //     });
  // };

  return (
    <SafeAreaView style={voiceCall ? AppStyle.wrapper : styles.wrapper}>
      <View style={AppStyle.homeMainView}>
        <View style={{ flex: 4 }}>
          {voiceCall ? (
            <View>
              <TouchableOpacity
                onPress={() => hitHanupCall()}
                style={styles.backArrowBox}
              >
                <Image source={ic_brownArrow} />
              </TouchableOpacity>

              <CustomText
                textColor={colors.black}
                text={callData}
                alignText={'center'}
                textSize={20}
                marginTop={hp(5)}
                fontWeight={'500'}
              />
              <CustomText
                textColor={colors.black}
                text={timerCount > 0 ? secondsToHMS(timerCount) : 'Connecting'}
                alignText={'center'}
                textSize={12}
                marginTop={hp(1)}
                fontWeight={'400'}
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

              {isLoading ? (
                <Text
                  style={{
                    color: colors.white,
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: hp(40),
                    bottom: hp(40),
                  }}
                >
                  Connecting
                </Text>
              ) : null}

              {participants.sortedRemoteParticipants.length > 0 ? (
                <TouchableOpacity
                  style={{
                    height: hp(25),
                    width: wp(40),
                    backgroundColor: 'green',
                    position: 'absolute',
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
      </View>
    </SafeAreaView>
  );
};
export default CallScreen;
